import { NextResponse } from "next/server";
import { db } from "@/firebase/firebase";
import { ref, get, child, update } from "firebase/database";

export async function POST(req: Request) {
  try {
    const notification = await req.json();
    console.log("Midtrans Notification received:", notification);

    const { order_id, transaction_status, fraud_status } = notification;

    if (!db) {
      console.warn("Mock DB mode: Ignoring webhook update.");
      return NextResponse.json({ status: "ok" });
    }

    const dbRef = ref(db);
    const paymentSnap = await get(child(dbRef, `payments/${order_id}`));

    if (!paymentSnap.exists()) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    const paymentData = paymentSnap.val();
    let isSuccess = false;

    if (transaction_status === "capture") {
      if (fraud_status === "accept") isSuccess = true;
    } else if (transaction_status === "settlement") {
      isSuccess = true;
    } else if (
      transaction_status === "cancel" ||
      transaction_status === "deny" ||
      transaction_status === "expire"
    ) {
      await update(ref(db, `payments/${order_id}`), { status: "failed" });
    }

    if (isSuccess) {
      // Update Payment Status
      await update(ref(db, `payments/${order_id}`), { status: "success" });
      
      // Update User Premium Status
      if (paymentData.userId) {
        await update(ref(db, `users/${paymentData.userId}`), { premium: true });
        console.log(`User ${paymentData.userId} upgraded to PREMIUM!`);
      }
    }

    return NextResponse.json({ status: "success" });
  } catch (error: any) {
    console.error("Webhook error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

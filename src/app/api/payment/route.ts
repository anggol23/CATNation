import { NextResponse } from "next/server";
import { snap } from "@/lib/midtrans";
import { db } from "@/firebase/firebase";
import { ref, set } from "firebase/database";

export async function POST(req: Request) {
  try {
    const { userId, name, email, amount } = await req.json();

    const orderId = `TRX-${Date.now()}-${userId.substring(0, 5)}`;

    const parameter = {
      transaction_details: {
        order_id: orderId,
        gross_amount: amount,
      },
      customer_details: {
        first_name: name,
        email: email,
      },
    };

    const transaction = await snap.createTransaction(parameter);
    
    // Store pending transaction in RTDB
    if (db) {
      await set(ref(db, `payments/${orderId}`), {
        userId,
        amount,
        status: "pending",
        createdAt: new Date().toISOString()
      });
    }

    return NextResponse.json({ token: transaction.token, orderId });
  } catch (error: any) {
    console.error("Payment API Error:", error);
    // Return specific error if available from Midtrans
    const errorMessage = error.ApiResponse?.error_messages?.[0] || error.message || "Internal Server Error";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}

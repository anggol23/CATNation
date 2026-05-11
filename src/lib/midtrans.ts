import Midtrans from "midtrans-client";

const serverKey = process.env.MIDTRANS_SERVER_KEY || "";
const isProd = serverKey.startsWith("Mid-"); // Production keys start with Mid-, Sandbox with SB-

export const snap = new Midtrans.Snap({
  isProduction: isProd,
  serverKey: serverKey,
  clientKey: process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY || ""
});

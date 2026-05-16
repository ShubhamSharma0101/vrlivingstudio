"use server";

import { resend } from "@/lib/resend";
import { AdminOrderAlertEmail } from "@/emails/admin-order-alert";

type Input = {
  orderId: string;
  customerEmail: string;
  total: number;
};

export async function sendAdminOrderAlert(input: Input) {
  // 🛡️ Safeguard runtime: absolute fallback address configuration
  const targetAdminEmail = 
    process.env.ADMIN_EMAIL || "shubhamsharma.dev01@gmail.com";

  await resend.emails.send({
    from: "VR Living Studio Alert <onboarding@resend.dev>",
    to: targetAdminEmail,
    // Added a dynamic price preview value right into your inbox notification header
    subject: `🚨 New Order Received - ₹${input.total.toFixed(2)}`,
    react: AdminOrderAlertEmail({
      orderId: input.orderId,
      customerEmail: input.customerEmail,
      total: input.total,
    }),
  });

  return {
    success: true,
  };
}
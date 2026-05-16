"use server";

import { resend } from "@/lib/resend";
import { OrderConfirmationEmail } from "@/emails/order-confirmation";

type Input = {
  email: string;
  customerName: string;
  orderId: string;
  total: number;
};

export async function sendOrderEmail(input: Input) {
  // 🛡️ Forces fallback redirection to avoid Resend Sandbox breaking on customer addresses
  const recipientEmail =
    process.env.NODE_ENV === "development"
      ? (process.env.ADMIN_EMAIL || "shubhamsharma.dev01@gmail.com")
      : input.email;

  await resend.emails.send({
    from: "VR Living Studio <onboarding@resend.dev>",
    to: recipientEmail,
    subject: `Order Confirmation - VR Living Studio`,
    react: OrderConfirmationEmail({
      customerName: input.customerName,
      orderId: input.orderId,
      total: input.total,
    }),
  });
}
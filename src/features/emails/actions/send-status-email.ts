"use server";

import { resend } from "@/lib/resend";
import { OrderStatusEmail } from "@/emails/order-status-email";

type Input = {
  email: string;
  customerName: string;
  orderId: string;
  status: string;
};

// Helper function to format the subject line text nicely
const formatSubjectStatus = (status: string) => {
  const lowercase = status.toLowerCase();
  return lowercase.charAt(0).toUpperCase() + lowercase.slice(1);
};

export async function sendStatusEmail(input: Input) {
  // 🛡️ Safe fallback redirection for Resend Sandbox limits during local testing
  const recipientEmail =
    process.env.NODE_ENV === "development"
      ? (process.env.ADMIN_EMAIL || "shubhamsharma.dev01@gmail.com")
      : input.email;

  const readableStatus = formatSubjectStatus(input.status);

  await resend.emails.send({
    from: "VR Living Studio <onboarding@resend.dev>",
    to: recipientEmail,
    subject: `VR Living Studio: Order ${readableStatus}`,
    react: OrderStatusEmail({
      customerName: input.customerName,
      orderId: input.orderId,
      status: input.status,
    }),
  });

  return {
    success: true,
  };
}
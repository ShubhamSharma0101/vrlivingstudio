"use server";

import { revalidatePath } from "next/cache";
import { OrderStatus } from "@/generated/prisma";
import { prisma } from "@/server/db/prisma";
// 🚀 Added the missing import for your status email server action
import { sendStatusEmail } from "@/features/emails/actions/send-status-email";


type Input = {
  orderId: string;
  status: OrderStatus;
};

export async function updateOrderStatus(input: Input) {
  // 1. Fetch the order details along with the associated user info
  const existingOrder = await prisma.order.findUnique({
    where: {
      id: input.orderId,
    },
    include: {
      user: true,
    },
  });

  if (!existingOrder) {
    throw new Error("Order not found");
  }

  // 2. Only run modifications if the new status is actually different
  if (existingOrder.status !== input.status) {
    await prisma.order.update({
      where: {
        id: input.orderId,
      },
      data: {
        status: input.status,
      },
    });

    // 3. Trigger the customer notification email if an email address exists
    if (existingOrder.user?.email) {
      try {
        await sendStatusEmail({
          email: existingOrder.user.email,
          customerName: existingOrder.user.name ?? "Customer",
          orderId: existingOrder.id,
          status: input.status as string, // Cast to string matching your input types
        });
      } catch (emailError) {
        // Log notification failures cleanly so the main status change isn't blocked
        console.error("Failed to send order status update email:", emailError);
      }
    }

    // 4. Purge Next.js On-Demand Caches to reflect updates instantly across views
    revalidatePath("/admin/orders");
    revalidatePath(`/orders/${input.orderId}`);
  }

  return {
    success: true,
  };
}
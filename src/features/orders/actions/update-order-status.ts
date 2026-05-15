"use server";

import { revalidatePath } from "next/cache";

import { OrderStatus } from "@/generated/prisma";

import { prisma } from "@/server/db/prisma";

type Input = {
  orderId: string;
  status: OrderStatus;
};

export async function updateOrderStatus(
  input: Input
) {
  await prisma.order.update({
    where: {
      id: input.orderId,
    },

    data: {
      status: input.status,
    },
  });

  revalidatePath(
    "/admin/orders"
  );

  revalidatePath(
    `/orders/${input.orderId}`
  );

  return {
    success: true,
  };
}
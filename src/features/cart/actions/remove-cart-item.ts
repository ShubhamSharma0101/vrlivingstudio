"use server";

import { revalidatePath } from "next/cache";

import { prisma } from "@/server/db/prisma";

import { getCurrentUser } from "@/lib/auth";

export async function removeCartItem(
  cartItemId: string
) {
  const user =
    await getCurrentUser();

  if (!user) {
    throw new Error(
      "Unauthorized"
    );
  }

  await prisma.cartItem.delete({
    where: {
      id: cartItemId,
    },
  });

  revalidatePath("/cart");

  return {
    success: true,
  };
}
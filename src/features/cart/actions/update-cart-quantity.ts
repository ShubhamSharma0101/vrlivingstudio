"use server";

import { revalidatePath } from "next/cache";

import { prisma } from "@/server/db/prisma";

import { getCurrentUser } from "@/lib/auth";

type UpdateCartQuantityInput = {
  cartItemId: string;
  action: "increase" | "decrease";
};

export async function updateCartQuantity(
  input: UpdateCartQuantityInput
) {
  const user =
    await getCurrentUser();

  if (!user) {
    throw new Error(
      "Unauthorized"
    );
  }

  const cartItem =
    await prisma.cartItem.findUnique({
      where: {
        id: input.cartItemId,
      },

      include: {
        product: true,
      },
    });

  if (
    !cartItem ||
    cartItem.userId !== user.id
  ) {
    throw new Error(
      "Cart item not found"
    );
  }

  if (
    input.action ===
    "increase"
  ) {
    if (
      cartItem.quantity >=
      cartItem.product.stock
    ) {
      throw new Error(
        "Maximum stock reached"
      );
    }

    await prisma.cartItem.update({
      where: {
        id: cartItem.id,
      },

      data: {
        quantity: {
          increment: 1,
        },
      },
    });
  }

  if (
    input.action ===
    "decrease"
  ) {
    if (
      cartItem.quantity <= 1
    ) {
      await prisma.cartItem.delete({
        where: {
          id: cartItem.id,
        },
      });
    } else {
      await prisma.cartItem.update({
        where: {
          id: cartItem.id,
        },

        data: {
          quantity: {
            decrement: 1,
          },
        },
      });
    }
  }

  revalidatePath("/cart");

  return {
    success: true,
  };
}
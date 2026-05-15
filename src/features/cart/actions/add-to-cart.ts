"use server";

import { revalidatePath } from "next/cache";

import { prisma } from "@/server/db/prisma";

import { getCurrentUser } from "@/lib/auth";

type AddToCartInput = {
  productId: string;
};

export async function addToCart(
  input: AddToCartInput
) {
  const user =
    await getCurrentUser();

  if (!user) {
    throw new Error(
      "Please login first"
    );
  }

  const product =
    await prisma.product.findUnique({
      where: {
        id: input.productId,
      },
    });

  if (!product) {
    throw new Error(
      "Product not found"
    );
  }

  const existingCartItem =
    await prisma.cartItem.findUnique({
      where: {
        userId_productId: {
          userId: user.id,
          productId:
            input.productId,
        },
      },
    });

  if (existingCartItem) {
    await prisma.cartItem.update({
      where: {
        id: existingCartItem.id,
      },

      data: {
        quantity: {
          increment: 1,
        },
      },
    });
  } else {
    await prisma.cartItem.create({
      data: {
        userId: user.id,
        productId:
          input.productId,
        quantity: 1,
      },
    });
  }

  revalidatePath("/cart");

  return {
    success: true,
  };
}
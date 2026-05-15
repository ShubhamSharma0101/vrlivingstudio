"use server";

import { revalidatePath } from "next/cache";

import { prisma } from "@/server/db/prisma";

type AdjustStockInput = {
  productId: string;
  quantity: number;
  note?: string;
};

export async function adjustStock(
  input: AdjustStockInput
) {
  const product =
    await prisma.product.findUnique({
      where: {
        id: input.productId,
      },
    });

  if (!product) {
    throw new Error("Product not found");
  }

  const updatedProduct =
    await prisma.product.update({
      where: {
        id: input.productId,
      },

      data: {
        stock:
          product.stock + input.quantity,
      },
    });

  await prisma.inventoryMovement.create({
    data: {
      productId: input.productId,

      quantity: input.quantity,

      type: "MANUAL_ADJUSTMENT",

      note:
        input.note ??
        "Manual inventory adjustment",
    },
  });

  revalidatePath("/admin/products");

  return {
    success: true,
    stock: updatedProduct.stock,
  };
}
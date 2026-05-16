"use server";

import { revalidatePath, revalidateTag } from "next/cache";
import { prisma } from "@/server/db/prisma";

type AdjustStockInput = {
  productId: string;
  quantity: number;
  note?: string;
};

export async function adjustStock(input: AdjustStockInput) {
  const product = await prisma.product.findUnique({
    where: {
      id: input.productId,
    },
  });

  if (!product) {
    throw new Error("Product not found");
  }

  const updatedProduct = await prisma.product.update({
    where: {
      id: input.productId,
    },
    data: {
      stock: product.stock + input.quantity,
    },
  });

  await prisma.inventoryMovement.create({
    data: {
      productId: input.productId,
      quantity: input.quantity,
      type: "MANUAL_ADJUSTMENT",
      note: input.note ?? "Manual inventory adjustment",
    },
  });

  // 1. Clear Admin Dashboard view
  revalidatePath("/admin/products");

  // 2. 🚀 Clear Public Storefront Views instantly
  revalidatePath("/products");
  revalidatePath(`/products/${product.slug}`);

  // 3. 🛡️ Force a hard data-cache reset immediately (bypassing stale-while-revalidate)
  revalidateTag("products", { expire: 0 });

  return {
    success: true,
    stock: updatedProduct.stock,
  };
}
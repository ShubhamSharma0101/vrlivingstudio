"use server";

import { prisma } from "@/server/db/prisma";
import { revalidatePath } from "next/cache";

export async function deleteProduct(productId: string) {
  // 1. Await the update, but DO NOT return the raw Prisma object
  await prisma.product.update({
    where: {
      id: productId,
    },
    data: {
      deletedAt: new Date(),
      status: "ARCHIVED",
    },
  });

  // 2. Tell Next.js to refresh the data on your products page
  revalidatePath("/admin/products");

  // 3. Return a plain, serializable object back to the Client Component
  return { success: true };
}
"use server";

import { prisma } from "@/server/db/prisma";
import { revalidatePath } from "next/cache";

export async function restoreProduct(productId: string) {
  // 1. Await the update but DO NOT return the raw Prisma instance
  await prisma.product.update({
    where: {
      id: productId,
    },
    data: {
      deletedAt: null,
      status: "ACTIVE",
    },
  });

  // 2. Tell Next.js to refresh the UI for the admin products layout
  revalidatePath("/admin/products", "layout");

  // 3. Return a clean, plain JavaScript object to the Client Component
  return { success: true };
}
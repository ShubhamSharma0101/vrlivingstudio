"use server";

import { revalidatePath } from "next/cache";

import { prisma } from "@/server/db/prisma";

type DeleteProductImageInput = {
  imageId: string;
  productId: string;
};

export async function deleteProductImage(
  input: DeleteProductImageInput
) {
  await prisma.productImage.delete({
    where: {
      id: input.imageId,
    },
  });

  revalidatePath(
    `/admin/products/${input.productId}`
  );

  return {
    success: true,
  };
}
"use server";

import { revalidatePath } from "next/cache";

import { prisma } from "@/server/db/prisma";
import { revalidateTag } from "next/cache";

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

// Force reload data to catch new image maps
  revalidatePath("/products"); 
  revalidateTag("products", { expire: 0 });

  return {
    success: true,
  };
}
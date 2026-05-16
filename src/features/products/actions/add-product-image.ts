"use server";

import { revalidatePath } from "next/cache";
import { revalidateTag } from "next/cache";

import { prisma } from "@/server/db/prisma";

type AddProductImageInput = {
  productId: string;
  url: string;
};

export async function addProductImage(
  input: AddProductImageInput
) {
  await prisma.productImage.create({
    data: {
      productId: input.productId,
      url: input.url,
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
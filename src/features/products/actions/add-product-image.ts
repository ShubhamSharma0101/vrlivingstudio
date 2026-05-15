"use server";

import { revalidatePath } from "next/cache";

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

  return {
    success: true,
  };
}
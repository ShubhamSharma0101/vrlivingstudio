"use server";

import { revalidatePath } from "next/cache";

import { prisma } from "@/server/db/prisma";

type SetPrimaryImageInput = {
  imageId: string;
  productId: string;
};

export async function setPrimaryImage(
  input: SetPrimaryImageInput
) {
  await prisma.productImage.updateMany({
    where: {
      productId: input.productId,
    },

    data: {
      isPrimary: false,
    },
  });

  await prisma.productImage.update({
    where: {
      id: input.imageId,
    },

    data: {
      isPrimary: true,
    },
  });

  revalidatePath(
    `/admin/products/${input.productId}`
  );

  return {
    success: true,
  };
}
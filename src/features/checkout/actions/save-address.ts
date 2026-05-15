"use server";

import { revalidatePath } from "next/cache";

import { prisma } from "@/server/db/prisma";

import { getCurrentUser } from "@/lib/auth";

import {
  addressSchema,
  type AddressInput,
} from "../schemas/address.schema";

export async function saveAddress(
  input: AddressInput
) {
  const user =
    await getCurrentUser();

  if (!user) {
    throw new Error(
      "Unauthorized"
    );
  }

  const validated =
    addressSchema.parse(
      input
    );

  const hasAddress =
    await prisma.address.findFirst({
      where: {
        userId: user.id,
      },
    });

  await prisma.address.create({
    data: {
      userId: user.id,

      fullName:
        validated.fullName,

      phone:
        validated.phone,

      line1:
        validated.line1,

      line2:
        validated.line2,

      city:
        validated.city,

      state:
        validated.state,

      postalCode:
        validated.postalCode,

      country:
        validated.country,

      isDefault:
        !hasAddress,
    },
  });

  revalidatePath(
    "/checkout"
  );

  return {
    success: true,
  };
}
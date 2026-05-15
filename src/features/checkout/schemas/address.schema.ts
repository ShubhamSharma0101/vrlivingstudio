import { z } from "zod";

export const addressSchema =
  z.object({
    fullName: z
      .string()
      .min(2),

    phone: z
      .string()
      .min(10),

    line1: z
      .string()
      .min(3),

    line2: z.string().optional(),

    city: z
      .string()
      .min(2),

    state: z
      .string()
      .min(2),

    postalCode: z
      .string()
      .min(4),

    country: z
      .string()
      .min(2),
  });

export type AddressInput =
  z.infer<
    typeof addressSchema
  >;
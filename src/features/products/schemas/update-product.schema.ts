import { z } from "zod";

import { ProductStatus } from "@/generated/prisma";

export const updateProductSchema = z.object({
  id: z.string(),

  title: z
    .string()
    .min(3)
    .max(120),

  description: z
    .string()
    .min(10),

  price: z.coerce
    .number()
    .positive(),

  stock: z.coerce
    .number()
    .int()
    .min(0),

  categoryId: z.string(),

  status: z.nativeEnum(ProductStatus),
});

export type UpdateProductInput =
  z.infer<typeof updateProductSchema>;
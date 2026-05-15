import { z } from "zod";

export const createProductSchema = z.object({
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

  categoryId: z.string().min(1),
});

export type CreateProductInput =
  z.infer<typeof createProductSchema>;
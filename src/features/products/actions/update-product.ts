"use server";

import slugify from "slugify";
import { prisma } from "@/server/db/prisma";
import {
  updateProductSchema,
  type UpdateProductInput,
} from "../schemas/update-product.schema";

export async function updateProduct(input: UpdateProductInput) {
  const validated = updateProductSchema.parse(input);

  const slug = slugify(validated.title, {
    lower: true,
    strict: true,
    trim: true,
  });

  // 1. Await the database update transaction first
  const product = await prisma.product.update({
    where: {
      id: validated.id,
    },
    data: {
      title: validated.title,
      slug,
      description: validated.description,
      price: validated.price,
      categoryId: validated.categoryId,
      status: validated.status,
    },
  });

  // 2. FIXED: Strip out the Prisma Decimal instance safely before returning to Client
  return {
    id: product.id,
    title: product.title,
    slug: product.slug,
    description: product.description,
    price: Number(product.price), // <-- Converts the Decimal class back into a plain JS number
    stock: product.stock,
    status: product.status,
    categoryId: product.categoryId,
  };
}
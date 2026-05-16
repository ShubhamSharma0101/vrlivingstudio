"use server";

import slugify from "slugify";
import { prisma } from "@/server/db/prisma";
import { revalidatePath } from "next/cache";
import { revalidateTag } from "next/cache";
import {
  createProductSchema,
  type CreateProductInput,
} from "../schemas/product.schema";

export async function createProduct(input: CreateProductInput) {
  const validated = createProductSchema.parse(input);

  const slug = slugify(validated.title, {
    lower: true,
    strict: true,
    trim: true,
  });

  // Await the database creation query first
  const product = await prisma.product.create({
    data: {
      title: validated.title,
      slug,
      description: validated.description,
      price: validated.price,
      stock: validated.stock,
      categoryId: validated.categoryId,
      status: "ACTIVE",
    },
  });

// Clear the main products listing grid
  revalidatePath("/products");
  
  // Force cache refresh
  revalidateTag("products", { expire: 0 });

  // Map the record to a plain, Next.js-friendly object
  return {
    id: product.id,
    title: product.title,
    slug: product.slug,
    description: product.description,
    price: Number(product.price), // Safe translation: converts Decimal instance to standard plain number
    stock: product.stock,
    status: product.status,
    categoryId: product.categoryId,
  };
}
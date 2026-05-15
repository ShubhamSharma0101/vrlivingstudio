"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { ProductStatus } from "@/generated/prisma";

import { createProduct } from "../actions/create-product";
import { updateProduct } from "../actions/update-product";

type Category = {
  id: string;
  name: string;
};

type ProductFormProps = {
  categories: Category[];

  initialData?: {
    id: string;
    title: string;
    description: string;
    price: string;
    stock: number;
    categoryId: string;
    status: ProductStatus;
  };
};

export function CreateProductForm({
  categories,
  initialData,
}: ProductFormProps) {
  const router = useRouter();

  const [loading, setLoading] =
    useState(false);

  const isEditing = !!initialData;

async function handleSubmit(formData: FormData) {
    setLoading(true);

    try {
      if (isEditing && initialData) {
        await updateProduct({
          id: initialData.id,
          title: formData.get("title") as string,
          description: formData.get("description") as string,
          price: Number(formData.get("price")),
          stock: Number(formData.get("stock")),
          categoryId: formData.get("categoryId") as string,
          status: formData.get("status") as ProductStatus,
        });

        // 1. Tell Next.js to fetch fresh layout data behind the scenes
        router.refresh();
        
        // 2. Instantly redirect the user away BEFORE popping any blocking dialogs
        router.push("/admin/products");
      } else {
        await createProduct({
          title: formData.get("title") as string,
          description: formData.get("description") as string,
          price: Number(formData.get("price")),
          stock: Number(formData.get("stock")),
          categoryId: formData.get("categoryId") as string,
        });

        router.refresh();
        router.push("/admin/products");
      }
    } catch (error) {
      console.error(error);
      alert("Something went wrong");
      setLoading(false); // Make sure to reset loading if it fails
    }
    // Note: We removed 'finally' because router.push changes the page context. 
    // Resetting states during a page change can cause React unmounted component memory leaks.
  }

  return (
    <form
      action={handleSubmit}
      className="space-y-4"
    >
      <input
        name="title"
        placeholder="Title"
        defaultValue={initialData?.title}
        className="w-full rounded-md border p-3"
      />

      <textarea
        name="description"
        placeholder="Description"
        defaultValue={
          initialData?.description
        }
        className="w-full rounded-md border p-3"
      />

      <input
        name="price"
        type="number"
        step="0.01"
        defaultValue={initialData?.price}
        placeholder="Price"
        className="w-full rounded-md border p-3"
      />

      <input
        name="stock"
        type="number"
        defaultValue={initialData?.stock}
        placeholder="Stock"
        className="w-full rounded-md border p-3"
      />

      <select
        name="categoryId"
        defaultValue={
          initialData?.categoryId
        }
        className="w-full rounded-md border p-3"
      >
        {categories.map((category) => (
          <option
            key={category.id}
            value={category.id}
          >
            {category.name}
          </option>
        ))}
      </select>

      {isEditing && (
        <select
          name="status"
          defaultValue={
            initialData?.status
          }
          className="w-full rounded-md border p-3"
        >
          {Object.values(ProductStatus).map(
            (status) => (
              <option
                key={status}
                value={status}
              >
                {status}
              </option>
            )
          )}
        </select>
      )}

      <button
        disabled={loading}
        className="rounded-md bg-black px-4 py-2 text-white"
      >
        {loading
          ? "Saving..."
          : isEditing
          ? "Update Product"
          : "Create Product"}
      </button>
    </form>
  );
}
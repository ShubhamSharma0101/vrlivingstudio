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
  const [loading, setLoading] = useState(false);
  const isEditing = !!initialData;

  async function handleSubmit(formData: FormData) {
    setLoading(true);

    try {
      if (isEditing && initialData) {
        // Handled cleanly: Only passing metadata matching our exact Zod Schema requirements
        await updateProduct({
          id: initialData.id,
          title: formData.get("title") as string,
          description: formData.get("description") as string,
          price: Number(formData.get("price")),
          categoryId: formData.get("categoryId") as string,
          status: formData.get("status") as ProductStatus,
        });

        router.refresh();
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
      setLoading(false);
    }
  }

  return (
    <form action={handleSubmit} className="space-y-4">
      <div>
        <label className="text-sm font-medium mb-1 block">Title</label>
        <input
          name="title"
          placeholder="Title"
          defaultValue={initialData?.title}
          className="w-full rounded-md border p-3"
          required
        />
      </div>

      <div>
        <label className="text-sm font-medium mb-1 block">Description</label>
        <textarea
          name="description"
          placeholder="Description"
          defaultValue={initialData?.description}
          className="w-full rounded-md border p-3"
        />
      </div>

      <div>
        <label className="text-sm font-medium mb-1 block">Price</label>
        <input
          name="price"
          type="number"
          step="0.01"
          defaultValue={initialData?.price}
          placeholder="Price"
          className="w-full rounded-md border p-3"
          required
        />
      </div>

      {/* Stock DOM input rendered ONLY during item creation pipelines */}
      {!isEditing && (
        <div>
          <label className="text-sm font-medium mb-1 block text-gray-900">Initial Stock</label>
          <input
            name="stock"
            type="number"
            placeholder="Initial physical inventory quantity"
            className="w-full rounded-md border p-3"
            required
          />
        </div>
      )}

      <div>
        <label className="text-sm font-medium mb-1 block">Category</label>
        <select
          name="categoryId"
          defaultValue={initialData?.categoryId}
          className="w-full rounded-md border p-3"
        >
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
      </div>

      {isEditing && (
        <div>
          <label className="text-sm font-medium mb-1 block">Status</label>
          <select
            name="status"
            defaultValue={initialData?.status}
            className="w-full rounded-md border p-3"
          >
            {Object.values(ProductStatus).map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
        </div>
      )}

      <button
        disabled={loading}
        className="rounded-md bg-black px-4 py-2 text-white disabled:bg-gray-400 transition-colors"
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
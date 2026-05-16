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
    <form action={handleSubmit} className="space-y-5 max-w-2xl w-full">
      <div>
        <label className="text-sm font-medium text-neutral-700 mb-1.5 block">Title</label>
        <input
          name="title"
          placeholder="e.g., Premium Leather Backpack"
          defaultValue={initialData?.title}
          className="h-12 w-full rounded-xl border border-neutral-200 bg-neutral-50 px-4 text-sm text-neutral-900 placeholder-neutral-400 outline-none transition-all focus:border-neutral-900 focus:bg-white focus:ring-4 focus:ring-neutral-100"
          required
        />
      </div>

      <div>
        <label className="text-sm font-medium text-neutral-700 mb-1.5 block">Description</label>
        <textarea
          name="description"
          placeholder="Provide a detailed description of the product features..."
          defaultValue={initialData?.description}
          className="min-h-[150px] w-full rounded-xl border border-neutral-200 bg-neutral-50 p-4 text-sm text-neutral-900 placeholder-neutral-400 outline-none transition-all focus:border-neutral-900 focus:bg-white focus:ring-4 focus:ring-neutral-100 resize-none"
        />
      </div>

      <div>
        <label className="text-sm font-medium text-neutral-700 mb-1.5 block">Price</label>
        <input
          name="price"
          type="number"
          min="0"
          step="0.01"
          defaultValue={initialData?.price}
          placeholder="0.00"
          className="h-12 w-full rounded-xl border border-neutral-200 bg-neutral-50 px-4 text-sm text-neutral-900 placeholder-neutral-400 outline-none transition-all focus:border-neutral-900 focus:bg-white focus:ring-4 focus:ring-neutral-100"
          required
        />
      </div>

      {/* Stock DOM input rendered ONLY during item creation pipelines */}
      {!isEditing && (
        <div>
          <label className="text-sm font-medium text-neutral-700 mb-1.5 block">Initial Stock</label>
          <input
            name="stock"
            type="number"
            min="1"
            placeholder="Initial physical inventory quantity"
            className="h-12 w-full rounded-xl border border-neutral-200 bg-neutral-50 px-4 text-sm text-neutral-900 placeholder-neutral-400 outline-none transition-all focus:border-neutral-900 focus:bg-white focus:ring-4 focus:ring-neutral-100"
            required
          />
        </div>
      )}

      <div>
        <label className="text-sm font-medium text-neutral-700 mb-1.5 block">Category</label>
        <select
          name="categoryId"
          defaultValue={initialData?.categoryId}
          className="h-12 w-full rounded-xl border border-neutral-200 bg-neutral-50 px-4 text-sm text-neutral-900 outline-none transition-all focus:border-neutral-900 focus:bg-white focus:ring-4 focus:ring-neutral-100 cursor-pointer appearance-none bg-[url('data:image/svg+xml;bs12, %3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20fill%3D%22none%22%20viewBox%3D%220%200%2024%2024%22%20stroke-width%3D%221.5%22%20stroke%3D%22%236b7280%22%3E%3Cpath%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%20d%3D%22m19.5%208.25-7.5%207.5-7.5-7.5%22%20%2F%3E%3C%2Fsvg%3E')] bg-[length:1.25rem] bg-[right_1rem_center] bg-no-repeat pr-10"
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
          <label className="text-sm font-medium text-neutral-700 mb-1.5 block">Status</label>
          <select
            name="status"
            defaultValue={initialData?.status}
            className="h-12 w-full rounded-xl border border-neutral-200 bg-neutral-50 px-4 text-sm text-neutral-900 outline-none transition-all focus:border-neutral-900 focus:bg-white focus:ring-4 focus:ring-neutral-100 cursor-pointer appearance-none bg-[url('data:image/svg+xml;bs12, %3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20fill%3D%22none%22%20viewBox%3D%220%200%2024%2024%22%20stroke-width%3D%221.5%22%20stroke%3D%22%236b7280%22%3E%3Cpath%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%20d%3D%22m19.5%208.25-7.5%207.5-7.5-7.5%22%20%2F%3E%3C%2Fsvg%3E')] bg-[length:1.25rem] bg-[right_1rem_center] bg-no-repeat pr-10"
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
        className="inline-flex items-center justify-center w-full h-12 px-5 mt-2 rounded-xl bg-neutral-950 text-sm font-medium text-white shadow-sm hover:bg-neutral-800 active:scale-[0.99] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-950 transition-all disabled:bg-neutral-100 disabled:text-neutral-400 disabled:cursor-not-allowed disabled:transform-none"
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
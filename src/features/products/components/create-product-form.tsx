"use client";

import { useState } from "react";

import { createProduct } from "../actions/create-product";

export function CreateProductForm({
  categories,
}: {
  categories: {
    id: string;
    name: string;
  }[];
}) {
  const [loading, setLoading] =
    useState(false);

  async function handleSubmit(
    formData: FormData
  ) {
    setLoading(true);

    try {
      await createProduct({
        title: formData.get("title") as string,
        description: formData.get("description") as string,
        price: Number(formData.get("price")),
        stock: Number(formData.get("stock")),
        categoryId: formData.get("categoryId") as string,
      });

      alert("Product created");
    } catch (error) {
      console.error(error);

      alert("Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form
      action={handleSubmit}
      className="space-y-4"
    >
      <input
        name="title"
        placeholder="Title"
        className="w-full rounded-md border p-3"
      />

      <textarea
        name="description"
        placeholder="Description"
        className="w-full rounded-md border p-3"
      />

      <input
        name="price"
        type="number"
        step="0.01"
        placeholder="Price"
        className="w-full rounded-md border p-3"
      />

      <input
        name="stock"
        type="number"
        placeholder="Stock"
        className="w-full rounded-md border p-3"
      />

      <select
        name="categoryId"
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

      <button
        disabled={loading}
        className="rounded-md bg-black px-4 py-2 text-white"
      >
        {loading
          ? "Creating..."
          : "Create Product"}
      </button>
    </form>
  );
}
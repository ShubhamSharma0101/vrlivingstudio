"use client";

import { useRouter } from "next/navigation";

import { deleteProduct } from "../actions/delete-product";

export function DeleteProductButton({
  productId,
}: {
  productId: string;
}) {
  const router = useRouter();

  async function handleDelete() {
    const confirmed = confirm(
      "Are you sure you want to archive this product?"
    );

    if (!confirmed) {
      return;
    }

    try {
      await deleteProduct(productId);

      router.push("/admin/products");
    } catch (error) {
      console.error(error);

      alert("Failed to archive product");
    }
  }

  return (
    <button
      onClick={handleDelete}
      className="text-sm text-red-500"
    >
      Archive
    </button>
  );
}
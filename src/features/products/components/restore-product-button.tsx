"use client";

import { useRouter } from "next/navigation";

import { restoreProduct } from "../actions/restore-product";

export function RestoreProductButton({
  productId,
}: {
  productId: string;
}) {
  const router = useRouter();

  async function handleRestore() {
    try {
      await restoreProduct(productId);

      router.push("/admin/products");
    } catch (error) {
      console.error(error);

      alert("Failed to restore product");
    }
  }

  return (
    <button
      onClick={handleRestore}
      className="text-sm text-green-600"
    >
      Restore
    </button>
  );
}
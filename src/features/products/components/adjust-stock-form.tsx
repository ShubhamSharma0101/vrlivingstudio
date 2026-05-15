"use client";

import { useState } from "react";

import { useRouter } from "next/navigation";

import { adjustStock } from "../actions/adjust-stock";

export function AdjustStockForm({
  productId,
  currentStock,
}: {
  productId: string;
  currentStock: number;
}) {
  const router = useRouter();

  const [loading, setLoading] =
    useState(false);

  async function handleSubmit(
    formData: FormData
  ) {
    setLoading(true);

    try {
      await adjustStock({
        productId,

        quantity: Number(
          formData.get("quantity")
        ),

        note:
          formData.get("note") as string,
      });

      router.refresh();
    } catch (error) {
      console.error(error);

      alert("Failed to adjust stock");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form
      action={handleSubmit}
      className="space-y-4 rounded-xl border p-6"
    >
      <div>
        <h2 className="text-xl font-semibold">
          Inventory Adjustment
        </h2>

        <p className="text-sm text-muted-foreground">
          Current stock: {currentStock}
        </p>
      </div>

      <input
        name="quantity"
        type="number"
        placeholder="Adjustment amount (+/-)"
        className="w-full rounded-md border p-3"
      />

      <textarea
        name="note"
        placeholder="Reason for adjustment"
        className="w-full rounded-md border p-3"
      />

      <button
        disabled={loading}
        className="rounded-md bg-black px-4 py-2 text-white"
      >
        {loading
          ? "Updating..."
          : "Adjust Stock"}
      </button>
    </form>
  );
}
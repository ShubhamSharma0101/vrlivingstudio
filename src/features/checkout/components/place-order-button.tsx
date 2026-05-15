"use client";

import { useState } from "react";

import { useRouter } from "next/navigation";

import { createOrder } from "../actions/create-order";

export function PlaceOrderButton({
  addressId,
}: {
  addressId: string;
}) {
  const router =
    useRouter();

  const [loading, setLoading] =
    useState(false);

  async function handleOrder() {
    try {
      setLoading(true);

      const result =
        await createOrder(
          addressId
        );

      router.push(
        `/orders/${result.orderId}`
      );
    } catch (error) {
      console.error(error);

      alert(
        "Unable to place order"
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      onClick={
        handleOrder
      }
      disabled={loading}
      className="w-full rounded-md bg-black px-6 py-3 text-white"
    >
      {loading
        ? "Placing Order..."
        : "Place Order"}
    </button>
  );
}
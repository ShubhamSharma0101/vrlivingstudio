"use client";

import { useState } from "react";

import { useRouter } from "next/navigation";

import { addToCart } from "../actions/add-to-cart";

export function AddToCartButton({
  productId,
}: {
  productId: string;
}) {
  const router = useRouter();

  const [loading, setLoading] =
    useState(false);

  async function handleAddToCart() {
    try {
      setLoading(true);

      await addToCart({
        productId,
      });

      router.refresh();

      alert(
        "Added to cart"
      );
    } catch (error) {
      console.error(error);

      alert(
        "Please sign in first"
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      onClick={
        handleAddToCart
      }
      disabled={loading}
      className="rounded-md bg-black px-6 py-3 text-white"
    >
      {loading
        ? "Adding..."
        : "Add To Cart"}
    </button>
  );
}
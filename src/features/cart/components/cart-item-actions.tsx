"use client";

import { useState } from "react";

import { useRouter } from "next/navigation";

import { updateCartQuantity } from "../actions/update-cart-quantity";

import { removeCartItem } from "../actions/remove-cart-item";

export function CartItemActions({
  cartItemId,
}: {
  cartItemId: string;
}) {
  const router = useRouter();

  const [loading, setLoading] =
    useState(false);

  async function handleQuantity(
    action:
      | "increase"
      | "decrease"
  ) {
    try {
      setLoading(true);

      await updateCartQuantity({
        cartItemId,
        action,
      });

      router.refresh();
    } catch (error) {
      console.error(error);

      alert(
        "Unable to update cart"
      );
    } finally {
      setLoading(false);
    }
  }

  async function handleRemove() {
    try {
      setLoading(true);

      await removeCartItem(
        cartItemId
      );

      router.refresh();
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex items-center gap-2">
      <button
        disabled={loading}
        onClick={() =>
          handleQuantity(
            "decrease"
          )
        }
        className="rounded border px-3 py-1"
      >
        -
      </button>

      <button
        disabled={loading}
        onClick={() =>
          handleQuantity(
            "increase"
          )
        }
        className="rounded border px-3 py-1"
      >
        +
      </button>

      <button
        disabled={loading}
        onClick={
          handleRemove
        }
        className="ml-3 text-sm text-red-500"
      >
        Remove
      </button>
    </div>
  );
}
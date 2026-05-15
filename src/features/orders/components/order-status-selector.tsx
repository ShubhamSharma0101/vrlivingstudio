"use client";

import { useState } from "react";

import { useRouter } from "next/navigation";

import { OrderStatus } from "@/generated/prisma";

import { updateOrderStatus } from "../actions/update-order-status";

export function OrderStatusSelector({
  orderId,
  currentStatus,
}: {
  orderId: string;
  currentStatus: OrderStatus;
}) {
  const router =
    useRouter();

  const [loading, setLoading] =
    useState(false);

  async function handleChange(
    status: OrderStatus
  ) {
    try {
      setLoading(true);

      await updateOrderStatus({
        orderId,
        status,
      });

      router.refresh();
    } catch (error) {
      console.error(error);

      alert(
        "Failed to update order"
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <select
      disabled={loading}
      defaultValue={
        currentStatus
      }
      onChange={(e) =>
        handleChange(
          e.target
            .value as OrderStatus
        )
      }
      className="rounded border p-2"
    >
      {Object.values(
        OrderStatus
      ).map((status) => (
        <option
          key={status}
          value={status}
        >
          {status}
        </option>
      ))}
    </select>
  );
}
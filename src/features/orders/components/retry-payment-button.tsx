"use client";

import { useRouter } from "next/navigation";

export function RetryPaymentButton({
  orderId,
}: {
  orderId: string;
}) {
  const router =
    useRouter();

  return (
    <button
      onClick={() =>
        router.push(
          `/checkout?retry=${orderId}`
        )
      }
      className="rounded-md bg-black px-4 py-2 text-white"
    >
      Retry Payment
    </button>
  );
}
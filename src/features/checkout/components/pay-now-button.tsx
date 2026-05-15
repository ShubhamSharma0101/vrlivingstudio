"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createPaymentOrder } from "../actions/create-payment-order";

// 1. Define strict types for the Razorpay Failure Response to satisfy ESLint
interface RazorpayFailedResponse {
  error: {
    code: string;
    description: string;
    source: string;
    step: string;
    reason: string;
    metadata: {
      payment_id?: string;
      order_id: string;
    };
  };
}

// 2. Define the missing '.on' method structure locally
interface RazorpayInstance {
  open: () => void;
  on: (
    event: "payment.failed",
    callback: (response: RazorpayFailedResponse) => Promise<void>
  ) => void;
}

export function PayNowButton({ addressId }: { addressId: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handlePayment() {
    try {
      setLoading(true);

      const paymentOrder = await createPaymentOrder(addressId);

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: paymentOrder.amount,
        currency: "INR",
        name: "VR Living Studio",
        description: "Order Payment",
        order_id: paymentOrder.razorpayOrderId,
        retry: {
          enabled: true,
        },
        modal: {
  ondismiss:
    async () => {
      try {
        await fetch(
          "/api/razorpay/failure",
          {
            method:
              "POST",

            headers: {
              "Content-Type":
                "application/json",
            },

            body:
              JSON.stringify({
                orderId:
                  paymentOrder.orderId,
              }),
          }
        );

        router.push(
          `/orders/${paymentOrder.orderId}`
        );
      } catch (error) {
        console.error(error);
      }
    },
},
        handler: async (response: {
          razorpay_order_id: string;
          razorpay_payment_id: string;
          razorpay_signature: string;
        }) => {
          const verify = await fetch("/api/razorpay/verify", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(response),
          });

          const result = await verify.json();

          if (result.success) {
            router.push(`/orders/${result.orderId}`);
          } else {
            alert("Payment verification failed");
          }
        },
        theme: {
          color: "#000000",
        },
      };

      // 3. Cast window safely to bypass the incomplete definition without using 'any'
      const RazorpayTypedConstructor = (
        window as unknown as {
          Razorpay: new (options: Record<string, unknown>) => RazorpayInstance;
        }
      ).Razorpay;

      const razorpay = new RazorpayTypedConstructor(
        options as unknown as Record<string, unknown>
      );

      // 4. Strongly typed event handler matching our interface
      razorpay.on("payment.failed", async (response: RazorpayFailedResponse) => {
        await fetch("/api/razorpay/failure", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            orderId: paymentOrder.orderId,
            razorpayPaymentId: response.error.metadata?.payment_id,
          }),
        });
        alert("Payment failed: " + response.error.description);
      });

      razorpay.open();
    } catch (error) {
      console.error(error);
      alert("Could not initialize payment");
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      disabled={loading}
      onClick={handlePayment}
      className="w-full rounded-md bg-black px-6 py-3 text-white transition hover:bg-black/90 disabled:opacity-50"
    >
      {loading ? "Processing..." : "Pay Now"}
    </button>
  );
}
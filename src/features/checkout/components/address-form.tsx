"use client";

import { useState } from "react";

import { useRouter } from "next/navigation";

import { saveAddress } from "../actions/save-address";

export function AddressForm() {
  const router =
    useRouter();

  const [loading, setLoading] =
    useState(false);

  async function handleSubmit(
    formData: FormData
  ) {
    try {
      setLoading(true);

      await saveAddress({
        fullName:
          formData.get(
            "fullName"
          ) as string,

        phone:
          formData.get(
            "phone"
          ) as string,

        line1:
          formData.get(
            "line1"
          ) as string,

        line2:
          formData.get(
            "line2"
          ) as string,

        city:
          formData.get(
            "city"
          ) as string,

        state:
          formData.get(
            "state"
          ) as string,

        postalCode:
          formData.get(
            "postalCode"
          ) as string,

        country:
          formData.get(
            "country"
          ) as string,
      });

      router.refresh();
    } catch (error) {
      console.error(error);

      alert(
        "Failed to save address"
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <form
      action={handleSubmit}
      className="space-y-4 rounded-xl border p-6"
    >
      <h2 className="text-xl font-bold">
        Shipping Address
      </h2>

      <input
        name="fullName"
        placeholder="Full Name"
        className="w-full rounded border p-3"
      />

      <input
        name="phone"
        placeholder="Phone"
        className="w-full rounded border p-3"
      />

      <input
        name="line1"
        placeholder="Address Line 1"
        className="w-full rounded border p-3"
      />

      <input
        name="line2"
        placeholder="Address Line 2"
        className="w-full rounded border p-3"
      />

      <input
        name="city"
        placeholder="City"
        className="w-full rounded border p-3"
      />

      <input
        name="state"
        placeholder="State"
        className="w-full rounded border p-3"
      />

      <input
        name="postalCode"
        placeholder="Postal Code"
        className="w-full rounded border p-3"
      />

      <input
        name="country"
        placeholder="Country"
        defaultValue="India"
        className="w-full rounded border p-3"
      />

      <button
        disabled={loading}
        className="rounded bg-black px-4 py-2 text-white"
      >
        {loading
          ? "Saving..."
          : "Save Address"}
      </button>
    </form>
  );
}
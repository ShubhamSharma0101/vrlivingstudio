import { redirect } from "next/navigation";

import { getCurrentUser } from "@/lib/auth";

import { prisma } from "@/server/db/prisma";

import { AddressForm } from "@/features/checkout/components/address-form";
import { PlaceOrderButton } from "@/features/checkout/components/place-order-button";

export default async function CheckoutPage() {
  const user =
    await getCurrentUser();

  if (!user) {
    redirect("/");
  }

  const [cartItems, addresses] =
    await Promise.all([
      prisma.cartItem.findMany({
        where: {
          userId: user.id,
        },

        include: {
          product: true,
        },
      }),

      prisma.address.findMany({
        where: {
          userId: user.id,
        },

        orderBy: {
          isDefault: "desc",
        },
      }),
    ]);

  if (cartItems.length === 0) {
    redirect("/cart"); 
  }

  const subtotal =
    cartItems.reduce(
      (acc, item) =>
        acc +
        Number(
          item.product.price
        ) *
          item.quantity,
      0
    );

  return (
    <div className="container mx-auto py-10">
      <h1 className="mb-8 text-4xl font-bold">
        Checkout
      </h1>

      <div className="grid gap-8 lg:grid-cols-2">
        <div>
          <AddressForm />

          {addresses.length >
            0 && (
            <div className="mt-6 rounded-xl border p-6">
              <h2 className="font-bold">
                Saved Addresses
              </h2>

              <div className="mt-4 space-y-4">
                {addresses.map(
                  (
                    address
                  ) => (
                    <div
                      key={
                        address.id
                      }
                      className="rounded border p-4"
                    >
                      <p className="font-medium">
                        {
                          address.fullName
                        }
                      </p>

                      <p>
                        {
                          address.line1
                        }
                      </p>

                      <p>
                        {
                          address.city
                        }
                        ,{" "}
                        {
                          address.state
                        }
                      </p>
                    </div>
                  )
                )}
              </div>
            </div>
          )}
        </div>

        <div className="rounded-xl border p-6">
          <h2 className="text-xl font-bold">
            Order Summary
          </h2>

          <div className="mt-4 space-y-4">
            {cartItems.map(
              (item) => (
                <div
                  key={
                    item.id
                  }
                  className="flex justify-between"
                >
                  <span>
                    {
                      item.product
                        .title
                    }
                    ×{" "}
                    {
                      item.quantity
                    }
                  </span>

                  <span>
                    ₹
                    {(
                      Number(
                        item
                          .product
                          .price
                      ) *
                      item.quantity
                    ).toFixed(
                      2
                    )}
                  </span>
                </div>
              )
            )}
          </div>

          <div className="mt-6 border-t pt-4">
            <div className="flex justify-between font-bold">
              <span>
                Total
              </span>

              <span>
                ₹
                {subtotal.toFixed(
                  2
                )}
              </span>
            </div>
          </div>

          {addresses[0] && (
              <div className="mt-6">
                <PlaceOrderButton
                  addressId={
                    addresses[0].id
                  }
                />
              </div>
            )}
        </div>
      </div>
    </div>
  );
}
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/server/db/prisma";
import { AddressForm } from "@/features/checkout/components/address-form";
import { PayNowButton } from "@/features/checkout/components/pay-now-button";

export default async function CheckoutPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/");
  }

  const [cartItems, addresses] = await Promise.all([
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

  const subtotal = cartItems.reduce(
    (acc, item) => acc + Number(item.product.price) * item.quantity,
    0
  );

  return (
    <div className="bg-[#faf8f5] py-20">
      <div className="container mx-auto px-4">
        
        {/* STEP 1: PREMIUM LUXURY HEADER */}
        <div className="mb-14">
          <p className="mb-3 text-sm uppercase tracking-[0.25em] text-neutral-500">
            Secure Checkout
          </p>
          <h1 className="text-5xl font-bold tracking-tight text-neutral-900">
            Complete Your Order
          </h1>
          <p className="mt-4 text-neutral-600 max-w-md">
            Your premium living experience is one step away.
          </p>
        </div>

        {/* STEP 2: PREMIUM RESPONSIVE SPLIT GRID */}
        <div className="grid gap-12 lg:grid-cols-[1fr_420px]">
          
          {/* LEFT COLUMN: MANAGEMENT & SELECTION PANELS */}
          <div className="space-y-10">
           

            {/* Saved Address Selection Cards */}
            {addresses.length > 0 && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-neutral-900 pl-2">
                  Saved Addresses
                </h2>

                <div className="space-y-4">
                  {addresses.map((address) => {
                    // Since this is a server component, we highlight the active default option
                    const isSelected = address.isDefault;

                    return (
                      <div
                        key={address.id}
                        className={`rounded-[32px] border bg-white p-8 shadow-sm transition ${
                          isSelected
                            ? "border-black ring-2 ring-black"
                            : "border-neutral-200 hover:border-neutral-400"
                        }`}
                      >
                        {/* CARD TOP LINE */}
                        <div className="mb-5 flex items-center justify-between">
                          <h3 className="text-xl font-semibold text-neutral-900">
                            {address.fullName}
                          </h3>
                          {address.isDefault && (
                            <span className="rounded-full bg-black px-4 py-2 text-xs font-medium text-white tracking-wide">
                              Default
                            </span>
                          )}
                        </div>

                        {/* ADDRESS CONTENT PARAGRAPH */}
                        <p className="mt-4 leading-7 text-neutral-600">
                          {address.line1}
                          <br />
                          {address.city}, {address.state}
                          <br />
                          {address.country} {address.postalCode}
                        </p>

                        {/* CONTACT BLOCK */}
                        <p className="mt-4 font-medium text-neutral-900">
                          {address.phone}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

             {/* Address Management Input Area */}
            <div className="rounded-[32px] bg-white p-8 shadow-sm border border-neutral-100/50">
              <AddressForm />
            </div>
          </div>

          {/* RIGHT COLUMN: STICKY ORDER SUMMARY PANEL */}
          <div className="relative">
            <div className="sticky top-28 rounded-[36px] bg-white p-8 shadow-sm border border-neutral-100/50">
              <h2 className="text-2xl font-bold text-neutral-900">
                Order Summary
              </h2>

              {/* LINE ITEMS WRAPPER */}
              <div className="mt-8 space-y-4 max-h-[240px] overflow-y-auto pr-2">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex justify-between text-neutral-600 text-sm">
                    <span className="truncate max-w-[240px]">
                      {item.product.title} <span className="text-neutral-400 font-medium">× {item.quantity}</span>
                    </span>
                    <span className="font-medium text-neutral-900">
                      ₹{(Number(item.product.price) * item.quantity).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>

              {/* VISUAL DIVIDER */}
              <div className="my-6 border-t border-neutral-200" />

              {/* TOTAL ROW */}
              <div className="flex items-center justify-between mb-8">
                <span className="text-lg font-medium text-neutral-800">
                  Total
                </span>
                <span className="text-3xl font-bold text-black tracking-tight">
                  ₹{subtotal.toFixed(2)}
                </span>
              </div>

              {/* SECURE INTEGRATED GATEWAY EXECUTION BUTTON */}
              {addresses[0] && (
                <div className="w-full">
                  <PayNowButton addressId={addresses[0].id} />
                </div>
              )}

              {/* PAYMENT TRUST UI HOUSING CONTAINER */}
              <div className="mt-8 rounded-[28px] bg-[#faf8f5] p-5">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-black text-white text-lg">
                    🔒
                  </div>
                  <div>
                    <p className="font-medium text-neutral-900">
                      Secure Payment
                    </p>
                    <p className="text-sm text-neutral-500">
                      Protected by Razorpay
                    </p>
                  </div>
                </div>

                <div className="mt-4 flex gap-3 text-xs font-semibold text-neutral-400 uppercase tracking-wider border-t border-neutral-200/60 pt-3 pl-1">
                  <span>Visa</span>
                  <span>Mastercard</span>
                  <span>UPI</span>
                  <span>Wallets</span>
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
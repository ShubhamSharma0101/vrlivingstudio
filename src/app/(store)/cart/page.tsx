import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/server/db/prisma";
import { CartItemActions } from "@/features/cart/components/cart-item-actions";

export default async function CartPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/");
  }

  const cartItems = await prisma.cartItem.findMany({
    where: {
      userId: user.id,
    },
    include: {
      product: {
        include: {
          images: {
            where: { isPrimary: true },
            take: 1,
          },
        },
      },
    },
  });

  // Handle empty state within premium canvas wrapper
  if (cartItems.length === 0) {
    return (
      <div className="bg-[#faf8f5] py-20">
        <div className="container mx-auto flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
          <h1 className="text-3xl font-bold text-neutral-900">Your Cart is Empty</h1>
          <p className="mt-3 text-neutral-500 max-w-sm">
            Looks like you haven&apos;t added any luxury pieces to your collection yet.
          </p>
          <Link
            href="/products"
            className="mt-8 inline-flex h-14 items-center justify-center rounded-xl bg-black px-8 font-medium text-white transition hover:bg-neutral-800"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  const subtotal = cartItems.reduce(
    (acc, item) => acc + Number(item.product.price) * item.quantity,
    0
  );

  return (
    <div className="bg-[#faf8f5] py-20">
      <div className="container mx-auto px-4">
        
        {/* PREMIUM HEADER */}
        <div className="mb-14">
          <p className="mb-3 text-sm uppercase tracking-[0.25em] text-neutral-500">
            Your Collection
          </p>
          <h1 className="text-5xl font-bold tracking-tight text-neutral-900">
            Shopping Cart
          </h1>
        </div>

        {/* MAIN LAYOUT GRID */}
        <div className="grid gap-12 lg:grid-cols-[1fr_420px]">
          
          {/* CART ITEMS LIST */}
          <div className="space-y-6">
            {cartItems.map((item) => {
              const image = item.product.images[0];

              return (
                <div
                  key={item.id}
                  className="flex flex-col sm:flex-row items-start sm:items-center gap-6 rounded-[32px] bg-white p-6 shadow-sm border border-neutral-100/40"
                >
                  {/* Large Product Image wrapper */}
                  <div className="relative h-32 w-32 flex-shrink-0 overflow-hidden rounded-[24px] bg-neutral-50 border border-neutral-100">
                    {image ? (
                      <Image
                        src={image.url}
                        alt={item.product.title}
                        fill
                        unoptimized
                        sizes="128px"
                        className="object-cover"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-xs text-neutral-400">
                        No Image
                      </div>
                    )}
                  </div>

                  {/* Product Details Area */}
                  <div className="flex flex-1 flex-col space-y-1">
                    <Link
                      href={`/products/${item.product.slug}`}
                      className="text-2xl font-semibold text-neutral-900 hover:opacity-80 transition"
                    >
                      {item.product.title}
                    </Link>
                    <p className="text-sm text-neutral-500">
                      Quantity: {item.quantity}
                    </p>
                    <div className="pt-2">
                      <CartItemActions cartItemId={item.id} />
                    </div>
                  </div>

                  {/* Individual Accumulative Item Pricing Block */}
                  <div className="text-left sm:text-right text-xl font-bold text-neutral-900 sm:min-w-[120px]">
                    ₹{(Number(item.product.price) * item.quantity).toFixed(2)}
                  </div>
                </div>
              );
            })}
          </div>

          {/* STICKY ORDER SUMMARY SIDEBAR */}
          <div className="relative">
            <div className="sticky top-28 rounded-[36px] bg-white p-8 shadow-sm border border-neutral-100/40">
              <h2 className="text-2xl font-bold text-neutral-900 mb-6">
                Order Summary
              </h2>
              
              <div className="flex justify-between items-center text-lg border-b border-neutral-100 pb-6 mb-6">
                <span className="text-neutral-600">Subtotal</span>
                <span className="text-2xl font-bold text-black">
                  ₹{subtotal.toFixed(2)}
                </span>
              </div>

              {/* Premium Checkout Action Button */}
              <Link
                href="/checkout"
                className="h-14 w-full rounded-xl bg-black text-white font-medium flex items-center justify-center transition hover:bg-neutral-900 shadow-md shadow-black/5"
              >
                Proceed To Checkout
              </Link>

              {/* Secure Trust Stamp */}
              <p className="mt-6 text-sm text-neutral-500 text-center">
                Secure checkout powered by Razorpay.
              </p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
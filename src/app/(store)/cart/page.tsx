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

  // Handle empty state before the main return
  if (cartItems.length === 0) {
    return (
      <div className="container mx-auto flex min-h-[70vh] flex-col items-center justify-center px-4 text-center">
        <h1 className="text-3xl font-bold">Your Cart is Empty</h1>
        <p className="mt-3 text-muted-foreground">
          Looks like you haven&apos;t added anything yet.
        </p>
        <Link
          href="/products"
          className="mt-6 rounded-md bg-black px-6 py-3 text-white transition hover:bg-black/90"
        >
          Continue Shopping
        </Link>
      </div>
    );
  }

  const subtotal = cartItems.reduce(
    (acc, item) => acc + Number(item.product.price) * item.quantity,
    0
  );

  return (
    <div className="container mx-auto py-10 px-4">
      <h1 className="mb-8 text-4xl font-bold">Cart</h1>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Items List */}
        <div className="space-y-4 lg:col-span-2">
          {cartItems.map((item) => {
            const image = item.product.images[0];

            return (
              <div
                key={item.id}
                className="flex items-center gap-4 rounded-xl border p-4 shadow-sm"
              >
                <div className="relative h-24 w-24 flex-shrink-0 overflow-hidden rounded-lg border">
                  {image ? (
                    <Image
                      src={image.url}
                      alt={item.product.title}
                      fill
                      unoptimized
                      sizes="96px"
                      className="object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-muted text-xs text-muted-foreground">
                      No Image
                    </div>
                  )}
                </div>

                <div className="flex flex-1 flex-col">
                  <Link
                    href={`/products/${item.product.slug}`}
                    className="font-semibold hover:underline"
                  >
                    {item.product.title}
                  </Link>
                  <p className="text-sm text-muted-foreground">
                    Quantity: {item.quantity}
                  </p>
                  <div className="mt-2">
                    <CartItemActions cartItemId={item.id} />
                  </div>
                </div>

                <div className="text-right font-bold">
                  ₹{(Number(item.product.price) * item.quantity).toFixed(2)}
                </div>
              </div>
            );
          })}
        </div>

        {/* Summary Sidebar */}
        <div className="h-fit space-y-6 rounded-xl border p-6 shadow-sm">
          <h2 className="text-xl font-bold border-b pb-4">Order Summary</h2>
          <div className="flex justify-between text-lg">
            <span>Subtotal</span>
            <span className="font-bold">₹{subtotal.toFixed(2)}</span>
          </div>

          <Link
            href="/checkout"
            className="block w-full rounded-md bg-black px-6 py-3 text-center text-white"
          >
            Proceed To Checkout
          </Link>
        </div>
      </div>
    </div>
  );
}
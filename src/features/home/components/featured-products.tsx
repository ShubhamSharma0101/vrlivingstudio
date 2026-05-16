import Link from "next/link";
import Image from "next/image";

import {
  getCachedProducts,
} from "@/server/cache/storefront-cache";

export async function FeaturedProducts() {
  const products =
    await getCachedProducts();

  const featured =
    products.slice(0, 4);

  return (
    <section className="bg-[#faf8f5] py-24">
      <div className="container mx-auto px-4">
        <div className="mb-14 flex items-end justify-between">
          <div>
            <p className="mb-3 text-sm uppercase tracking-[0.25em] text-neutral-500">
              Premium Selection
            </p>

            <h2 className="text-4xl font-bold md:text-5xl">
              Featured Products
            </h2>
          </div>

          <Link
            href="/products"
            className="hidden text-sm font-medium lg:block"
          >
            View All →
          </Link>
        </div>

        <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-4">
          {featured.map(
            (product) => (
              <Link
                href={`/products/${product.slug}`}
                key={
                  product.id
                }
                className="group"
              >
                <div className="overflow-hidden rounded-[32px] bg-white shadow-sm transition duration-300 hover:-translate-y-2 hover:shadow-2xl">
                  <div className="relative h-[360px] overflow-hidden">
                    <Image
                      src={
                        product
                          .images[0]
                          ?.url ??
                        "/placeholder.png"
                      }
                      alt={
                        product.title
                      }
                      fill
                      className="object-cover transition duration-700 group-hover:scale-110"
                    />
                  </div>

                  <div className="p-6">
                    <span className="text-sm text-neutral-500">
                      {
                        product
                          .category
                          .name
                      }
                    </span>

                    <h3 className="mt-2 text-xl font-semibold">
                      {
                        product.title
                      }
                    </h3>

                    <div className="mt-4 flex items-center justify-between">
                      <span className="text-xl font-bold">
                        ₹
                        {Number(
                          product.price
                        ).toFixed(
                          2
                        )}
                      </span>

                      <span className="text-sm">
                        View →
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            )
          )}
        </div>
      </div>
    </section>
  );
}
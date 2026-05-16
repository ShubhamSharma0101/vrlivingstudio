import Image from "next/image";

import Link from "next/link";

import { getCachedProducts,} from "@/server/cache/storefront-cache";



export default async function ProductsPage() {
  const products = await getCachedProducts();

  return (
    <div className="container mx-auto py-10">
      <div className="mb-8">
        <h1 className="text-4xl font-bold">
          Products
        </h1>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {products.map((product) => {
          const primaryImage =
            product.images[0];

          return (
            <Link
              key={product.id}
              href={`/products/${product.slug}`}
              className="space-y-4 rounded-xl border p-4 transition hover:shadow-lg"
            >
              <div className="relative aspect-square overflow-hidden rounded-lg bg-muted">
                {primaryImage ? (
                  <Image
                    src={primaryImage.url}
                    alt={product.title}
                    fill
                    unoptimized
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="object-cover"
                  />
                ) : null}
              </div>

              <div>
                <h2 className="font-semibold">
                  {product.title}
                </h2>

                <p className="text-lg font-bold">
                  ₹
                  {product.price.toString()}
                </p>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
import Image from "next/image";
import Link from "next/link";
import { getCachedProducts, getCachedCategories } from "@/server/cache/storefront-cache";

type Props = {
  searchParams: Promise<{
    category?: string;
    sort?: string;
    stock?: string;
  }>;
};

export default async function ProductsPage({ searchParams }: Props) {
  // Step 2 — Get Search Params
  const params = await searchParams;
  const selectedCategory = params.category;
  const sort = params.sort;
  const stock = params.stock;

  // Step 3 — Filter Products Server Side
  const categories = await getCachedCategories();
  let products = await getCachedProducts();

  if (selectedCategory) {
    products = products.filter(
      (product) => product.category?.slug === selectedCategory
    );
  }

  if (stock === "in-stock") {
    products = products.filter((product) => product.stock > 0);
  }

  if (sort === "price-asc") {
    products.sort((a, b) => Number(a.price) - Number(b.price));
  }

  if (sort === "price-desc") {
    products.sort((a, b) => Number(b.price) - Number(a.price));
  }

  if (sort === "newest") {
    products.sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }

  return (
    <div className="container mx-auto py-10 px-4">
      <div className="mb-8">
        <h1 className="text-4xl font-bold">Products</h1>
      </div>

      {/* Modern Two-Column Layout for Sidebar + Content */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-4">
        
        {/* Step 4 — Premium Filter Sidebar (Fixed with Next.js Link) */}
        <div className="lg:col-span-1">
          <aside className="rounded-[32px] bg-white p-8 shadow-sm border border-neutral-100">
            <h2 className="mb-8 text-xl font-semibold">Filters</h2>

            {/* Category */}
            <div className="mb-8">
              <h3 className="mb-4 font-medium">Category</h3>
              <div className="space-y-3">
                <Link href="/products" className="block text-neutral-700 hover:text-black transition">
                  All Products
                </Link>

                {categories.map((category) => (
                  <Link
                    key={category.id}
                    href={`/products?category=${category.slug}`}
                    className={`block transition ${
                      selectedCategory === category.slug
                        ? "font-semibold text-black"
                        : "text-neutral-600 hover:text-black"
                    }`}
                  >
                    {category.name}
                  </Link>
                ))}
              </div>
            </div>

            {/* Stock */}
            <div className="mb-8">
              <h3 className="mb-4 font-medium">Availability</h3>
              <Link
                href="/products?stock=in-stock"
                className={`block transition ${
                  stock === "in-stock"
                    ? "font-semibold text-black"
                    : "text-neutral-600 hover:text-black"
                }`}
              >
                In Stock
              </Link>
            </div>

            {/* Sorting */}
            <div>
              <h3 className="mb-4 font-medium">Sort By</h3>
              <div className="space-y-3">
                <Link
                  href="/products?sort=newest"
                  className={`block transition ${
                    sort === "newest" ? "font-semibold text-black" : "text-neutral-600 hover:text-black"
                  }`}
                >
                  Newest
                </Link>
                <Link
                  href="/products?sort=price-asc"
                  className={`block transition ${
                    sort === "price-asc" ? "font-semibold text-black" : "text-neutral-600 hover:text-black"
                  }`}
                >
                  Price: Low to High
                </Link>
                <Link
                  href="/products?sort=price-desc"
                  className={`block transition ${
                    sort === "price-desc" ? "font-semibold text-black" : "text-neutral-600 hover:text-black"
                  }`}
                >
                  Price: High to Low
                </Link>
              </div>
            </div>
          </aside>
        </div>

        {/* Product Grid Area */}
        <div className="lg:col-span-3">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {/* Step 5 — Empty State & Render Mapping */}
            {products.length === 0 ? (
              <div className="col-span-full rounded-[32px] bg-white p-20 text-center border border-dashed">
                <h2 className="text-2xl font-semibold">No products found</h2>
                <p className="mt-3 text-neutral-500">Try changing filters.</p>
              </div>
            ) : (
              products.map((product) => {
                const primaryImage = product.images?.[0];

                return (
                  <Link
                    key={product.id}
                    href={`/products/${product.slug}`}
                    className="space-y-4 rounded-xl border p-4 transition hover:shadow-lg bg-white"
                  >
                    <div className="relative aspect-square overflow-hidden rounded-lg bg-muted">
                      {primaryImage ? (
                        <Image
                          src={primaryImage.url}
                          alt={product.title}
                          fill
                          unoptimized
                          sizes="(max-width: 768px) 100vw, 33vw"
                          className="object-cover"
                        />
                      ) : null}
                    </div>

                    <div>
                      <h2 className="font-semibold text-neutral-800">
                        {product.title}
                      </h2>
                      <p className="text-lg font-bold mt-1">
                        ₹ {product.price.toString()}
                      </p>
                    </div>
                  </Link>
                );
              })
            )}
          </div>
        </div>

      </div>
    </div>
  );
}

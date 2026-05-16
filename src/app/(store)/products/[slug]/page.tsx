import Image from "next/image";
import { notFound } from "next/navigation";
import { AddToCartButton } from "@/features/cart/components/add-to-cart-button";
import { getCachedProduct } from "@/server/cache/storefront-cache";
import type { Metadata } from "next";



type Props = {
  params: Promise<{
    slug: string;
  }>;
};

// 1. Dynamic SEO Metadata Generation
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const product = await getCachedProduct(slug);

  // Fallback metadata protection if cached document isn't returned
  if (!product || product.deletedAt || product.status !== "ACTIVE") {
    return {};
  }

  const image = product.images[0]?.url ?? "/og-image.jpg";
  const title = `${product.title} | VR Living Studio`;
  const description = product.description.slice(0, 160);
  const url = `https://vrlivingstudio.com/products/${product.slug}`;

  return {
    title,
    description,
    alternates: {
      canonical: url,
    },
    keywords: [
      product.title,
      product.category?.name ?? "Decor",
      "Furniture",
      "Home Decor",
      "VR Living Studio",
    ],
    openGraph: {
      title,
      description,
      url,
      siteName: "VR Living Studio",
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: product.title,
        },
      ],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image],
    },
  };
}

// 2. Main Storefront View Representation Interface Component
export default async function ProductPage({ params }: Props) {
  const { slug } = await params;

  // 🚀 Swapped out raw Prisma call for the bug-fixed dynamic key cache handler
  const product = await getCachedProduct(slug);

  // Safety Gate: Ensure missing, deleted, or draft data streams trigger Next.js 404
  if (!product || product.deletedAt || product.status !== "ACTIVE") {
    notFound();
  }

  return (
    <div className="container mx-auto py-10">
      <div className="grid gap-10 lg:grid-cols-2">
        
        {/* Product Media Gallery Display Row */}
        <div className="space-y-4">
          {product.images.map((image) => (
            <div
              key={image.id}
              className="relative aspect-square overflow-hidden rounded-xl border"
            >
              <Image
                src={image.url}
                alt={product.title}
                fill
                unoptimized
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover"
              />
            </div>
          ))}
        </div>

        {/* Product Information Context Column */}
        <div className="space-y-6">
          <h1 className="text-4xl font-bold">{product.title}</h1>

          <p className="text-2xl font-semibold">
            ₹{Number(product.price).toFixed(2)}
          </p>

          <p className="text-muted-foreground whitespace-pre-line">
            {product.description}
          </p>

          <div>
            <p className="font-medium">
              Stock status:{" "}
              {product.stock > 0 ? (
                <span className="text-emerald-600">{product.stock} units left</span>
              ) : (
                <span className="text-destructive">Out of Stock</span>
              )}
            </p>
          </div>

          <div className="pt-4">
            {product.stock > 0 ? (
              <AddToCartButton productId={product.id} />
            ) : (
              <button
                disabled
                className="rounded-md bg-gray-300 px-6 py-3 text-gray-500 cursor-not-allowed font-medium"
              >
                Out Of Stock
              </button>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
import { notFound } from "next/navigation";
import type { Metadata } from "next";

import { getCachedProduct, getRelatedProducts } from "@/server/cache/storefront-cache";
import { ProductGallery } from "@/features/products/components/product-gallery";
import { ProductBuyCard } from "@/features/products/components/product-buy-card";
import { ProductTrustBadges } from "@/features/products/components/product-trust-badges";
import { RelatedProducts } from "@/features/products/components/related-products";

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

  const product = await getCachedProduct(slug);

  // 🛡️ 1. Safety Gate: Trigger 404 immediately if product is missing or inactive
  if (!product || product.deletedAt || product.status !== "ACTIVE") {
    notFound();
  }

  // 🚀 2. FIXED: Moving this below the guard tells TypeScript 'product' is guaranteed to exist!
  const relatedProducts = await getRelatedProducts(
    product.categoryId,
    product.id
  );

  return (
    <div className="bg-[#faf8f5] py-20">
      <div className="container mx-auto px-4">
        {/* Main Product Column Layout */}
        <div className="grid gap-16 lg:grid-cols-[1.2fr_0.8fr]">
          <ProductGallery images={product.images} />

          <div>
            <ProductBuyCard
              id={product.id}
              title={product.title}
              description={product.description}
              price={Number(product.price)}
              stock={product.stock}
            />

            <ProductTrustBadges />
          </div>
        </div>

        {/* 🌟 UX Fix: Placed outside the upper grid to span full-width gracefully */}
        <RelatedProducts products={relatedProducts} />
      </div>
    </div>
  );
}
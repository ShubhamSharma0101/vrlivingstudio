import Image from "next/image";

import { notFound } from "next/navigation";

import { prisma } from "@/server/db/prisma";

import { AddToCartButton } from "@/features/cart/components/add-to-cart-button";

type Props = {
  params: Promise<{
    slug: string;
  }>;
};

import type {
  Metadata,
} from "next";

type MetadataProps = {
  params: Promise<{
    slug: string;
  }>;
};

export async function generateMetadata({
  params,
}: MetadataProps): Promise<Metadata> {
  const { slug } =
    await params;

  const product =
    await prisma.product.findUnique({
      where: {
        slug,
      },

      include: {
        images: {
          where: {
            isPrimary: true,
          },

          take: 1,
        },

        category: true,
      },
    });

  if (!product) {
    return {};
  }

  const image =
    product.images[0]
      ?.url ??
    "/og-image.jpg";

  const title =
    `${product.title} | VR Living Studio`;

  const description =
    product.description.slice(
      0,
      160
    );

  const url =
    `https://vrlivingstudio.com/products/${product.slug}`;

  return {
    title,

    description,

    alternates: {
      canonical:
        url,
    },

    keywords: [
      product.title,
      product.category
        .name,
      "Furniture",
      "Home Decor",
      "VR Living Studio",
    ],

    openGraph: {
      title,

      description,

      url,

      siteName:
        "VR Living Studio",

      images: [
        {
          url: image,

          width: 1200,

          height: 630,

          alt:
            product.title,
        },
      ],

      type:
        "website",
    },

    twitter: {
      card:
        "summary_large_image",

      title,

      description,

      images: [image],
    },
  };
}

export default async function ProductPage({
  params,
}: Props) {
  const { slug } = await params;

  const product =
    await prisma.product.findUnique({
      where: {
        slug,
      },

      include: {
        images: true,
      },
    });

  if (
    !product ||
    product.deletedAt ||
    product.status !== "ACTIVE"
  ) {
    notFound();
  }

  return (
    <div className="container mx-auto py-10">
      <div className="grid gap-10 lg:grid-cols-2">
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

        <div className="space-y-6">
          <h1 className="text-4xl font-bold">
            {product.title}
          </h1>

          <p className="text-2xl font-semibold">
            ₹
            {product.price.toString()}
          </p>

          <p className="text-muted-foreground">
            {product.description}
          </p>

          <div>
            <p className="font-medium">
              Stock: {product.stock}
            </p>
          </div>
          <div className="pt-4">
            <AddToCartButton
              productId={product.id}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
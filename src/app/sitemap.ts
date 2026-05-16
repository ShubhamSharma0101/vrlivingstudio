import { MetadataRoute } from "next";

import { prisma } from "@/server/db/prisma";

export default async function sitemap():
Promise<MetadataRoute.Sitemap> {
  const products =
  await prisma.product.findMany({
    where: {
      deletedAt: null,

      status:
        "ACTIVE",
    },
  });

  const productUrls =
    products.map(
      (product) => ({
        url:
          `https://vrlivingstudio.com/products/${product.slug}`,

        lastModified:
          product.updatedAt,
      })
    );

  return [
    {
      url:
        "https://vrlivingstudio.com",

      lastModified:
        new Date(),
    },

    {
      url:
        "https://vrlivingstudio.com/products",

      lastModified:
        new Date(),
    },

    ...productUrls,
  ];
}
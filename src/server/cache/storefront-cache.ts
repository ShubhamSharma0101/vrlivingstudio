import { unstable_cache } from "next/cache";

import { prisma } from "@/server/db/prisma";

export const getCachedProducts =
  unstable_cache(
    async () => {
      return prisma.product.findMany({
        where: {
          deletedAt: null,
          status:"ACTIVE",
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

        orderBy: {
          createdAt: "desc",
        },
      });
    },

    ["store-products"],

    {
      revalidate: 300,
      tags: [
        "products",
      ],
    }
  );

export const getCachedProduct =
  unstable_cache(
    async (
      slug: string
    ) => {
      return prisma.product.findUnique({
        where: {
          slug,
        },

        include: {
          images: {
            orderBy: {
              sortOrder:
                "asc",
            },
          },

          category: true,
        },
      });
    },

    ["product-detail"],

    {
      revalidate: 300,
      tags: [
        "products",
      ],
    }
  );

  export async function getRelatedProducts(
  categoryId: string,
  currentProductId: string
) {
  return prisma.product.findMany({
    where: {
      deletedAt: null,

      status: "ACTIVE",

      categoryId,

      NOT: {
        id: currentProductId,
      },
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

    take: 4,
  });
}

export const getCachedCategories =
  unstable_cache(
    async () => {
      return prisma.category.findMany({
        orderBy: {
          name: "asc",
        },
      });
    },

    ["categories"],

    {
      revalidate: 3600,
      tags: [
        "categories",
      ],
    }
  );
import { prisma } from "@/server/db/prisma";

import { RestoreProductButton } from "@/features/products/components/restore-product-button";

export default async function DeletedProductsPage() {
  const products =
    await prisma.product.findMany({
      where: {
        deletedAt: {
          not: null,
        },
      },

      orderBy: {
        deletedAt: "desc",
      },
    });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">
          Archived Products
        </h1>
      </div>

      <div className="space-y-4">
        {products.map((product) => (
          <div
            key={product.id}
            className="flex items-center justify-between rounded-lg border p-4"
          >
            <div>
              <p className="font-medium">
                {product.title}
              </p>
            </div>

            <RestoreProductButton
              productId={product.id}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
import { prisma } from "@/server/db/prisma";

import { CreateProductForm } from "@/features/products/components/create-product-form";

export default async function ProductsPage() {
  const categories =
    await prisma.category.findMany({
      orderBy: {
        name: "asc",
      },
    });

  return (
    <div className="max-w-2xl space-y-8">
      <div>
        <h1 className="text-3xl font-bold">
          Products
        </h1>

        <p className="text-muted-foreground">
          Create new products
        </p>
      </div>

      <CreateProductForm
        categories={categories}
      />
    </div>
  );
}
import { prisma } from "@/server/db/prisma";

import { CreateProductForm } from "@/features/products/components/create-product-form";

export default async function NewProductPage() {
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
          Create Product
        </h1>

        <p className="text-muted-foreground">
          Add a new product
        </p>
      </div>

      <CreateProductForm
        categories={categories}
      />
    </div>
  );
}
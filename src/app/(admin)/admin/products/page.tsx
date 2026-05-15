import Link from "next/link";

import { prisma } from "@/server/db/prisma";

import { ProductsTable } from "@/features/products/components/products-table";

export default async function ProductsPage() {
  const products =
    await prisma.product.findMany({
      include: {
        category: true,
      },

      orderBy: {
        createdAt: "desc",
      },
    });

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">
            Products
          </h1>

          <p className="text-muted-foreground">
            Manage your store products
          </p>
        </div>

        <Link
          href="/admin/products/new"
          className="rounded-md bg-black px-4 py-2 text-white"
        >
          Create Product
        </Link>
      </div>

      <ProductsTable
        products={products.map((product) => ({
          id: product.id,
          title: product.title,
          price: product.price.toString(),
          stock: product.stock,
          status: product.status,
          category: {
            name: product.category.name,
          },
        }))}
      />
    </div>
  );
}
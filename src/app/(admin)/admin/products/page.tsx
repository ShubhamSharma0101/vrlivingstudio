import Link from "next/link";
import Image from "next/image";
import { Plus } from "lucide-react";

import { prisma } from "@/server/db/prisma";
import { TableContainer } from "@/features/admin/components/table/table-container";
import { TableSearch } from "@/features/admin/components/table/table-search";
import { TableStatusBadge } from "@/features/admin/components/table/table-status-badge";
import { TableActions } from "@/features/admin/components/table/table-actions";
import { TableEmpty } from "@/features/admin/components/table/table-empty";

type Props = {
  searchParams: Promise<{
    q?: string;
  }>;
};

export default async function ProductsPage({
  searchParams,
}: Props) {
  const params = await searchParams;
  const q = params.q?.trim().toLowerCase() ?? "";

  const products = await prisma.product.findMany({
    where: {
      deletedAt: null,
      ...(q
        ? {
            OR: [
              { title: { contains: q, mode: "insensitive" } },
              { slug: { contains: q, mode: "insensitive" } },
            ],
          }
        : {}),
    },
    include: {
      category: true,
      images: {
        where: { isPrimary: true },
        take: 1,
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-8">
      <TableContainer
        title="Products"
        description="Manage your premium catalog"
        actions={
          <Link
            href="/admin/products/new"
            className="flex h-12 items-center gap-2 rounded-2xl bg-black px-5 text-white transition hover:opacity-90"
          >
            <Plus className="h-4 w-4" />
            Add Product
          </Link>
        }
      >
        <div className="border-b border-neutral-200 p-6">
          <TableSearch value={params.q} />
        </div>

        {products.length === 0 ? (
          <TableEmpty title="Products" />
        ) : (
          <table className="w-full">
            <thead className="border-b border-neutral-200 bg-neutral-50 text-left text-sm text-neutral-500">
              <tr>
                <th className="px-8 py-5">Product</th>
                <th className="px-8 py-5">Category</th>
                <th className="px-8 py-5">Price</th>
                <th className="px-8 py-5">Stock</th>
                <th className="px-8 py-5">Status</th>
                <th className="px-8 py-5 text-right">Actions</th>
              </tr>
            </thead>

            <tbody>
              {products.map((product) => (
                <tr key={product.id} className="border-b border-neutral-100 transition hover:bg-neutral-50">
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-5">
                      <div className="relative h-20 w-20 overflow-hidden rounded-2xl bg-neutral-100">
                        <Image
                          src={product.images[0]?.url ?? "/placeholder.png"}
                          alt={product.title}
                          fill
                          className="object-cover"
                        />
                      </div>

                      <div>
                        <h3 className="font-semibold">{product.title}</h3>
                        <p className="mt-1 text-sm text-neutral-500">#{product.id.slice(0, 8)}</p>
                      </div>
                    </div>
                  </td>

                  <td className="px-8 py-6 text-neutral-600">{product.category.name}</td>

                  <td className="px-8 py-6 font-medium">₹{Number(product.price).toLocaleString()}</td>

                  <td className="px-8 py-6">
                    <span className={`rounded-full px-4 py-2 text-sm ${product.stock <= 5 ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"}`}>
                      {product.stock}
                    </span>
                  </td>

                  <td className="px-8 py-6">
                    <TableStatusBadge status={product.status} />
                  </td>

                  <td className="px-8 py-6 text-right">
                    <TableActions editHref={`/admin/products/${product.id}`} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </TableContainer>
    </div>
  );
}
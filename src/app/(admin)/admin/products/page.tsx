import Link from "next/link";
import Image from "next/image";
import { Plus } from "lucide-react";

import { prisma } from "@/server/db/prisma";
import { TableContainer } from "@/features/admin/components/table/table-container";
import { TableSearch } from "@/features/admin/components/table/table-search";
import { TableStatusBadge } from "@/features/admin/components/table/table-status-badge";
import { TableActions } from "@/features/admin/components/table/table-actions";
import { TableEmpty } from "@/features/admin/components/table/table-empty";
import { TablePagination } from "@/features/admin/components/table/table-pagination";
import { TableFilter } from "@/features/admin/components/table/table-filter";

type Props = {
  searchParams: Promise<{
    page?: string;
    search?: string;
    status?: string;
    category?: string;
    stock?: string;
    price?: string;
  }>;
};

type ProductRow = {
  id: string;
  title: string;
  price: string;
  stock: number;
  status: string;
  category: {
    name: string;
  } | null;
  images: {
    url: string;
  }[];
};

export default async function ProductsPage({ searchParams }: Props) {
  const params = await searchParams;

  const page = Number(params.page) || 1;
  const limit = 10;

  const search = params.search ?? "";
  const status = params.status ?? "";
  const category = params.category ?? "";
  const stock = params.stock ?? "";
  const price = params.price ?? "";

  const categories = await prisma.category.findMany({
    orderBy: {
      name: "asc",
    },
  });

  const where = {
    deletedAt: null,

    ...(search
      ? {
        title: {
          contains: search,
          mode: "insensitive" as const,
        },
      }
      : {}),

    ...(status
      ? {
        status: status as
          | "DRAFT"
          | "ACTIVE"
          | "ARCHIVED"
      }
      : {}),

    ...(category
      ? {
        categoryId: category,
      }
      : {}),

    ...(stock === "IN_STOCK"
      ? {
        stock: {
          gt: 0,
        },
      }
      : {}),

    ...(stock === "LOW_STOCK"
      ? {
        stock: {
          gt: 0,
          lte: 5,
        },
      }
      : {}),

    ...(stock === "OUT_OF_STOCK"
      ? {
        stock: 0,
      }
      : {}),

    ...(price === "UNDER_1000"
      ? {
        price: {
          lt: 1000,
        },
      }
      : {}),

    ...(price === "1000_5000"
      ? {
        price: {
          gte: 1000,
          lte: 5000,
        },
      }
      : {}),

    ...(price === "5000_20000"
      ? {
        price: {
          gte: 5000,
          lte: 20000,
        },
      }
      : {}),

    ...(price === "PREMIUM"
      ? {
        price: {
          gt: 20000,
        },
      }
      : {}),
  };

  const [rawProducts, total] = await Promise.all([
    prisma.product.findMany({
      where,
      include: {
        category: true,
        images: {
          where: {
            isPrimary: true,
          },
          take: 1,
        },
      },
      orderBy: {
        createdAt: "desc",
      },
      skip: (page - 1) * limit,
      take: limit,
    }),

    prisma.product.count({
      where,
    }),
  ]);

  const products =
  rawProducts as unknown as ProductRow[];

  const totalPages = Math.max(1, Math.ceil(total / limit));

  const filtersQuery = new URLSearchParams();

  if (search) filtersQuery.set("search", search);
  if (status) filtersQuery.set("status", status);
  if (category) filtersQuery.set("category", category);
  if (stock) filtersQuery.set("stock", stock);
  if (price) filtersQuery.set("price", price);

  const paginationPathname = `/admin/products${filtersQuery.toString() ? `?${filtersQuery.toString()}` : ""
    }`;

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
        <div className="flex flex-wrap items-center gap-4 border-b border-neutral-200 p-6">
          <TableSearch />

          <TableFilter
            param="status"
            placeholder="Status"
            options={[
              {
                label: "Draft",
                value: "DRAFT",
              },
              {
                label: "Active",
                value: "ACTIVE",
              },
              {
                label: "Archived",
                value: "ARCHIVED",
              },
            ]}
          />

          <TableFilter
            param="category"
            placeholder="Category"
            options={categories.map((category) => ({
              label: category.name,
              value: category.id,
            }))}
          />

          <TableFilter
            param="stock"
            placeholder="Stock"
            options={[
              { label: "In Stock", value: "IN_STOCK" },
              { label: "Low Stock", value: "LOW_STOCK" },
              { label: "Out Of Stock", value: "OUT_OF_STOCK" },
            ]}
          />

          <TableFilter
            param="price"
            placeholder="Price"
            options={[
              { label: "Under ₹1k", value: "UNDER_1000" },
              { label: "₹1k - ₹5k", value: "1000_5000" },
              { label: "₹5k - ₹20k", value: "5000_20000" },
              { label: "Premium", value: "PREMIUM" },
            ]}
          />
        </div>

        {products.length === 0 ? (
          <TableEmpty title="Products" />
        ) : (
          <>
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
                  <tr
                    key={product.id}
                    className="border-b border-neutral-100 transition hover:bg-neutral-50"
                  >
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
                          <p className="mt-1 text-sm text-neutral-500">
                            #{product.id.slice(0, 8)}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="px-8 py-6 text-neutral-600">
                      {product.category?.name ?? "-"}
                    </td>

                    <td className="px-8 py-6 font-medium">
                      ₹{Number(product.price).toLocaleString()}
                    </td>

                    <td className="px-8 py-6">
                      <span
                        className={`rounded-full px-4 py-2 text-sm ${product.stock <= 5
                            ? "bg-red-100 text-red-700"
                            : "bg-green-100 text-green-700"
                          }`}
                      >
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

            <TablePagination
              page={page}
              totalPages={totalPages}
              pathname={paginationPathname}
            />
          </>
        )}
      </TableContainer>
    </div>
  );
}
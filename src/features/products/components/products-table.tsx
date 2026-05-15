import Link from "next/link";

import { ProductStatus } from "@/generated/prisma";
import { DeleteProductButton } from "./delete-product-button";

type ProductTableItem = {
  id: string;
  title: string;
  price: string;
  stock: number;
  status: ProductStatus;
  category: {
    name: string;
  };
};

export function ProductsTable({
  products,
}: {
  products: ProductTableItem[];
}) {
  return (
    <div className="overflow-hidden rounded-xl border bg-white">
      <table className="w-full">
        <thead className="border-b bg-muted/50">
          <tr>
            <th className="p-4 text-left">
              Product
            </th>

            <th className="p-4 text-left">
              Category
            </th>

            <th className="p-4 text-left">
              Price
            </th>

            <th className="p-4 text-left">
              Stock
            </th>

            <th className="p-4 text-left">
              Status
            </th>

            <th className="p-4 text-right">
              Actions
            </th>
          </tr>
        </thead>

        <tbody>
          {products.map((product) => (
            <tr
              key={product.id}
              className="border-b"
            >
              <td className="p-4 font-medium">
                {product.title}
              </td>

              <td className="p-4">
                {product.category.name}
              </td>

              <td className="p-4">
                ₹{product.price}
              </td>

              <td className="p-4">
                {product.stock}
              </td>

              <td className="p-4">
                <span className="rounded-full border px-3 py-1 text-xs">
                  {product.status}
                </span>
              </td>

              <td className="p-4">
                <div className="flex items-center gap-4">
                  <Link
                    href={`/admin/products/${product.id}`}
                    className="text-sm font-medium underline"
                  >
                    Edit
                  </Link>

                  <DeleteProductButton
                    productId={product.id}
                  />
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
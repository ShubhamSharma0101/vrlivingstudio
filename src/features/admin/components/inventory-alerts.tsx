import Image from "next/image";
import Link from "next/link";

type Product = {
  id: string;
  title: string;
  stock: number;
  slug: string;
  category: string;
  image: string | null;
};

export function InventoryAlerts({
  products,
}: {
  products: Product[];
}) {
  return (
    <div className="rounded-2xl border p-6">
      <div className="mb-5 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold">
            Inventory Alerts
          </h2>

          <p className="text-sm text-muted-foreground">
            Products requiring attention
          </p>
        </div>
      </div>

      {products.length ===
      0 ? (
        <div className="rounded-xl border border-dashed p-8 text-center text-sm text-muted-foreground">
          No low stock alerts
        </div>
      ) : (
        <div className="space-y-4">
          {products.map(
            (product) => (
              <div
                key={product.id}
                className="flex items-center justify-between rounded-xl border p-4"
              >
                <div className="flex items-center gap-4">
                  <div className="relative h-16 w-16 overflow-hidden rounded-lg border bg-muted">
                    {product.image ? (
                      <Image
                        src={
                          product.image
                        }
                        alt={
                          product.title
                        }
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center text-xs text-muted-foreground">
                        No Image
                      </div>
                    )}
                  </div>

                  <div>
                    <h3 className="font-medium">
                      {
                        product.title
                      }
                    </h3>

                    <p className="text-sm text-muted-foreground">
                      {
                        product.category
                      }
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <span
                    className={`rounded-full px-3 py-1 text-sm font-medium ${
                      product.stock <=
                      2
                        ? "bg-red-100 text-red-700"
                        : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {product.stock}
                    {" "}
                    left
                  </span>

                  <Link
                    href={`/admin/products/${product.id}`}
                    className="rounded-md border px-4 py-2 text-sm"
                  >
                    Edit
                  </Link>
                </div>
              </div>
            )
          )}
        </div>
      )}
    </div>
  );
}
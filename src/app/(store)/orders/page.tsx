import Link from "next/link";

import { redirect } from "next/navigation";

import { getCurrentUser } from "@/lib/auth";

import { prisma } from "@/server/db/prisma";

import { OrderStatusBadge } from "@/features/orders/components/order-status-badge";

export default async function OrdersPage() {
  const user =
    await getCurrentUser();

  if (!user) {
    redirect("/");
  }

  const orders =
    await prisma.order.findMany({
      where: {
        userId: user.id,
      },

      orderBy: {
        createdAt: "desc",
      },

      include: {
        items: {
          take: 3,
        },
      },
    });

  return (
    <div className="container mx-auto py-10">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold">
            My Orders
          </h1>

          <p className="text-muted-foreground">
            View your order history
          </p>
        </div>
      </div>

      {orders.length ===
      0 ? (
        <div className="rounded-xl border p-10 text-center">
          No orders found
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map(
            (order) => (
              <div
                key={order.id}
                className="rounded-xl border p-6"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-bold">
                      Order #
                      {order.id.slice(
                        0,
                        8
                      )}
                    </p>

                    <p className="text-sm text-muted-foreground">
                      {new Date(
                        order.createdAt
                      ).toLocaleDateString()}
                    </p>
                  </div>

                  <div className="text-right">
                    <div className="mb-2">
                      <OrderStatusBadge
                        status={
                          order.status
                        }
                      />
                    </div>

                    <p className="font-bold">
                      ₹
                      {Number(
                        order.totalAmount
                      ).toFixed(
                        2
                      )}
                    </p>
                  </div>
                </div>

                <div className="mt-4">
                  <p className="text-sm text-muted-foreground">
                    {order.items
                      .map(
                        (
                          item
                        ) =>
                          item.title
                      )
                      .join(
                        ", "
                      )}
                  </p>
                </div>

                <div className="mt-6">
                  <Link
                    href={`/orders/${order.id}`}
                    className="text-sm font-medium underline"
                  >
                    View Details
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
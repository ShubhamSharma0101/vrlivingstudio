import Link from "next/link";

import { prisma } from "@/server/db/prisma";

import { OrderStatusBadge } from "@/features/orders/components/order-status-badge";

import { OrderStatusSelector } from "@/features/orders/components/order-status-selector";

export default async function AdminOrdersPage() {
  const orders =
    await prisma.order.findMany({
      orderBy: {
        createdAt: "desc",
      },

      include: {
        user: true,
        items: true,
      },
    });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">
          Orders
        </h1>
      </div>

      <div className="overflow-hidden rounded-xl border">
        <table className="w-full">
          <thead className="border-b bg-muted">
            <tr>
              <th className="p-4 text-left">
                Order
              </th>

              <th className="p-4 text-left">
                Customer
              </th>

              <th className="p-4 text-left">
                Status
              </th>

              <th className="p-4 text-left">
                Total
              </th>

              <th className="p-4 text-left">
                Update
              </th>

              <th className="p-4 text-left">
                Action
              </th>
            </tr>
          </thead>

          <tbody>
            {orders.map(
              (order) => (
                <tr
                  key={order.id}
                  className="border-b"
                >
                  <td className="p-4">
                    #
                    {order.id.slice(
                      0,
                      8
                    )}
                  </td>

                  <td className="p-4">
                    {
                      order.user
                        ?.email
                    }
                  </td>

                  <td className="p-4">
                    <OrderStatusBadge
                      status={
                        order.status
                      }
                    />
                  </td>

                  <td className="p-4">
                    ₹
                    {Number(
                      order.totalAmount
                    ).toFixed(
                      2
                    )}
                  </td>

                  <td className="p-4">
                    <OrderStatusSelector
                      orderId={
                        order.id
                      }
                      currentStatus={
                        order.status
                      }
                    />
                  </td>

                  <td className="p-4">
                    <Link
                      href={`/admin/orders/${order.id}`}
                      className="underline"
                    >
                      View
                    </Link>
                  </td>
                </tr>
              )
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
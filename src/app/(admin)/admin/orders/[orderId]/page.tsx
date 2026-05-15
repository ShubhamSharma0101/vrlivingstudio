import { notFound } from "next/navigation";

import { prisma } from "@/server/db/prisma";

import { OrderStatusBadge } from "@/features/orders/components/order-status-badge";

type Props = {
  params: Promise<{
    orderId: string;
  }>;
};

export default async function AdminOrderPage({
  params,
}: Props) {
  const { orderId } =
    await params;

  const order =
    await prisma.order.findUnique({
      where: {
        id: orderId,
      },

      include: {
        items: true,
        user: true,
      },
    });

  if (!order) {
    notFound();
  }

  const address =
    order.addressSnapshot as {
      fullName: string;
      phone: string;
      line1: string;
      city: string;
      state: string;
    };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">
            Order
          </h1>

          <p>
            {order.id}
          </p>
        </div>

        <OrderStatusBadge
          status={
            order.status
          }
        />
      </div>

      <div className="rounded-xl border p-6">
        <h2 className="font-bold">
          Customer
        </h2>

        <p className="mt-2">
          {
            order.user
              ?.email
          }
        </p>
      </div>

      <div className="rounded-xl border p-6">
        <h2 className="font-bold">
          Shipping Address
        </h2>

        <div className="mt-2 space-y-1">
          <p>
            {
              address.fullName
            }
          </p>

          <p>
            {
              address.phone
            }
          </p>

          <p>
            {
              address.line1
            }
          </p>

          <p>
            {address.city}
            ,{" "}
            {address.state}
          </p>
        </div>
      </div>

      <div className="rounded-xl border p-6">
        <h2 className="font-bold">
          Items
        </h2>

        <div className="mt-4 space-y-3">
          {order.items.map(
            (item) => (
              <div
                key={item.id}
                className="flex justify-between"
              >
                <span>
                  {
                    item.title
                  }
                  ×{" "}
                  {
                    item.quantity
                  }
                </span>

                <span>
                  ₹
                  {(
                    Number(
                      item.price
                    ) *
                    item.quantity
                  ).toFixed(
                    2
                  )}
                </span>
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
}
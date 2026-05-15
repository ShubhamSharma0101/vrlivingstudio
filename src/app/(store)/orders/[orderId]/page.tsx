import { notFound } from "next/navigation";

import { prisma } from "@/server/db/prisma";

import { OrderStatusBadge } from "@/features/orders/components/order-status-badge";

type Props = {
  params: Promise<{
    orderId: string;
  }>;
};

export default async function OrderPage({
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
      },
    });

  if (!order) {
    notFound();
  }

  return (
    <div className="container mx-auto py-10">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold">
            Order Details
          </h1>

          <p className="text-muted-foreground">
            Order #
            {order.id}
          </p>
        </div>

        <OrderStatusBadge
          status={
            order.status
          }
        />
      </div>

      <div className="mt-8 rounded-xl border p-6">
        <h2 className="font-bold">
          Items
        </h2>

        <div className="mt-4 space-y-4">
          {order.items.map(
            (item) => (
              <div
                key={item.id}
                className="flex justify-between border-b pb-3"
              >
                <div>
                  <p className="font-medium">
                    {
                      item.title
                    }
                  </p>

                  <p className="text-sm text-muted-foreground">
                    Qty:
                    {" "}
                    {
                      item.quantity
                    }
                  </p>
                </div>

                <p className="font-bold">
                  ₹
                  {(
                    Number(
                      item.price
                    ) *
                    item.quantity
                  ).toFixed(
                    2
                  )}
                </p>
              </div>
            )
          )}
        </div>

        <div className="mt-6 border-t pt-4">
          <div className="flex justify-between font-bold">
            <span>
              Total
            </span>

            <span>
              ₹
              {Number(
                order.totalAmount
              ).toFixed(
                2
              )}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
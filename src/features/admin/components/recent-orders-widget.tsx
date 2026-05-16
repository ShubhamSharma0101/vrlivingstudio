type Order = {
  id: string;
  email: string;
  total: number;
  status: string;
};

export function RecentOrdersWidget({
  orders,
}: {
  orders: Order[];
}) {
  return (
    <div className="rounded-[32px] bg-white p-8 shadow-sm">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">
            Recent Orders
          </h2>

          <p className="text-sm text-neutral-500">
            Latest customer purchases
          </p>
        </div>
      </div>

      <div className="space-y-5">
        {orders.map((order) => (
          <div
            key={order.id}
            className="flex items-center justify-between rounded-2xl border border-neutral-200 p-5"
          >
            <div>
              <p className="font-medium">
                {order.email}
              </p>

              <p className="mt-1 text-sm text-neutral-500">
                #{order.id.slice(0, 8)}
              </p>
            </div>

            <div className="text-right">
              <p className="font-semibold">
                ₹
                {order.total.toLocaleString()}
              </p>

              <span className="mt-2 inline-flex rounded-full bg-neutral-100 px-4 py-1 text-xs font-medium">
                {order.status}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
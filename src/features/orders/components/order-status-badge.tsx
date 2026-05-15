import { OrderStatus } from "@/generated/prisma";

const statusClasses:
  Record<
    OrderStatus,
    string
  > = {
  PENDING:
    "bg-yellow-100 text-yellow-700",

  CONFIRMED:
    "bg-blue-100 text-blue-700",

  ON_HOLD:
    "bg-orange-100 text-orange-700",

  SHIPPED:
    "bg-indigo-100 text-indigo-700",

  DELIVERED:
    "bg-green-100 text-green-700",

  CANCELLED:
    "bg-red-100 text-red-700",

  REFUNDED:
    "bg-gray-100 text-gray-700",
};

export function OrderStatusBadge({
  status,
}: {
  status: OrderStatus;
}) {
  return (
    <span
      className={`rounded-full px-3 py-1 text-xs font-medium ${statusClasses[status]}`}
    >
      {status.replaceAll(
        "_",
        " "
      )}
    </span>
  );
}
import Link from "next/link";
import { Eye, Filter } from "lucide-react";

import { prisma } from "@/server/db/prisma";
import { TableContainer } from "@/features/admin/components/table/table-container";
import { TableSearch } from "@/features/admin/components/table/table-search";
import { TableStatusBadge } from "@/features/admin/components/table/table-status-badge";
import { TableEmpty } from "@/features/admin/components/table/table-empty";
import { TablePagination } from "@/features/admin/components/table/table-pagination";
import { TableFilter } from "@/features/admin/components/table/table-filter";
import { TableDateFilter } from "@/features/admin/components/table/table-date-filter";

type Props = {
  searchParams: Promise<{
    page?: string;
    search?: string;
    status?: string;
    payment?: string;
    date?: string;
  }>;
};

const ORDER_STATUSES = [
  "PENDING",
  "CONFIRMED",
  "ON_HOLD",
  "SHIPPED",
  "DELIVERED",
  "CANCELLED",
  "REFUNDED",
] as const;

const PAYMENT_STATUSES = [
  "PENDING",
  "PAID",
  "FAILED",
  "REFUNDED",
] as const;

type OrderStatus = (typeof ORDER_STATUSES)[number];
type PaymentStatus = (typeof PAYMENT_STATUSES)[number];

function isOrderStatus(value: string): value is OrderStatus {
  return ORDER_STATUSES.includes(value as OrderStatus);
}

function isPaymentStatus(value: string): value is PaymentStatus {
  return PAYMENT_STATUSES.includes(value as PaymentStatus);
}

function getDayRange(value: string) {
  const date =
    value === "today" ? new Date() : new Date(value);

  if (Number.isNaN(date.getTime())) {
    return null;
  }

  const start = new Date(date);
  start.setHours(0, 0, 0, 0);

  const end = new Date(date);
  end.setHours(23, 59, 59, 999);

  return { gte: start, lte: end };
}

export default async function AdminOrdersPage({
  searchParams,
}: Props) {
  const params = await searchParams;

  const page = Number(params.page) || 1;
  const limit = 10;

  const search = params.search ?? "";
  const status = params.status ?? "";
  const payment = params.payment ?? "";
  const date = params.date ?? "";

  const dateRange = date ? getDayRange(date) : null;

  const where = {
    ...(search
      ? {
          id: {
            contains: search,
            mode: "insensitive" as const,
          },
        }
      : {}),

    ...(status && isOrderStatus(status)
      ? { status }
      : {}),

    ...(payment && isPaymentStatus(payment)
      ? { paymentStatus: payment }
      : {}),

    ...(dateRange
      ? {
          createdAt: dateRange,
        }
      : {}),
  };

  const [orders, total] = await Promise.all([
    prisma.order.findMany({
      where,
      include: {
        user: true,
      },
      orderBy: {
        createdAt: "desc",
      },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.order.count({
      where,
    }),
  ]);

  const totalPages = Math.max(1, Math.ceil(total / limit));

  const filtersQuery = new URLSearchParams();
  if (search) filtersQuery.set("search", search);
  if (status) filtersQuery.set("status", status);
  if (payment) filtersQuery.set("payment", payment);
  if (date) filtersQuery.set("date", date);

  const paginationPathname = `/admin/orders${
    filtersQuery.toString() ? `?${filtersQuery.toString()}` : ""
  }`;

  return (
    <div className="space-y-8">
      <TableContainer
        title="Orders"
        description="Manage customer purchases"
        actions={
          <button className="flex h-12 items-center gap-2 rounded-2xl border border-neutral-200 px-5 transition hover:bg-neutral-100">
            <Filter className="h-4 w-4" />
            Filters
          </button>
        }
      >
        <div className="flex flex-wrap items-center gap-4 border-b border-neutral-200 p-6">
          <TableSearch />

          <TableFilter
            param="status"
            placeholder="All Orders"
            options={[
              { label: "Pending", value: "PENDING" },
              { label: "Confirmed", value: "CONFIRMED" },
              { label: "On Hold", value: "ON_HOLD" },
              { label: "Shipped", value: "SHIPPED" },
              { label: "Delivered", value: "DELIVERED" },
              { label: "Cancelled", value: "CANCELLED" },
              { label: "Refunded", value: "REFUNDED" },
            ]}
          />

          <TableFilter
            param="payment"
            placeholder="Payment"
            options={[
              { label: "Pending", value: "PENDING" },
              { label: "Paid", value: "PAID" },
              { label: "Failed", value: "FAILED" },
              { label: "Refunded", value: "REFUNDED" },
            ]}
          />

          <Link
            href={`/admin/orders?${new URLSearchParams({
              ...(search ? { search } : {}),
              ...(status ? { status } : {}),
              ...(payment ? { payment } : {}),
              date: "today",
            }).toString()}`}
            className="rounded-2xl border px-4 py-3 text-sm transition hover:bg-neutral-100"
          >
            Today
          </Link>

          <TableDateFilter param="date" />
        </div>

        {orders.length === 0 ? (
          <TableEmpty title="Orders" />
        ) : (
          <>
            <table className="w-full">
              <thead className="border-b border-neutral-200 bg-neutral-50 text-left text-sm text-neutral-500">
                <tr>
                  <th className="px-8 py-5">Order</th>
                  <th className="px-8 py-5">Customer</th>
                  <th className="px-8 py-5">Payment</th>
                  <th className="px-8 py-5">Total</th>
                  <th className="px-8 py-5">Status</th>
                  <th className="px-8 py-5">Date</th>
                  <th className="px-8 py-5 text-right">Action</th>
                </tr>
              </thead>

              <tbody>
                {orders.map((order) => (
                  <tr
                    key={order.id}
                    className="border-b border-neutral-100 transition hover:bg-neutral-50"
                  >
                    <td className="px-8 py-6">
                      <div>
                        <p className="font-semibold">
                          #{order.id.slice(0, 8)}
                        </p>
                        <p className="mt-1 text-sm text-neutral-500">
                          Razorpay
                        </p>
                      </div>
                    </td>

                    <td className="px-8 py-6">
                      <div>
                        <p className="font-medium">
                          {order.user?.name ?? "Unknown"}
                        </p>
                        <p className="mt-1 max-w-[220px] truncate text-sm text-neutral-500">
                          {order.user?.email ?? "-"}
                        </p>
                      </div>
                    </td>

                    <td className="px-8 py-6">
                      <TableStatusBadge status={order.paymentStatus} />
                    </td>

                    <td className="px-8 py-6 font-semibold">
                      ₹{Number(order.totalAmount).toLocaleString()}
                    </td>

                    <td className="px-8 py-6">
                      <TableStatusBadge status={order.status} />
                    </td>

                    <td className="px-8 py-6 text-neutral-600">
                      {new Date(order.createdAt).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </td>

                    <td className="px-8 py-6 text-right">
                      <Link
                        href={`/admin/orders/${order.id}`}
                        className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-neutral-200 transition hover:bg-neutral-100"
                      >
                        <Eye className="h-5 w-5" />
                      </Link>
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
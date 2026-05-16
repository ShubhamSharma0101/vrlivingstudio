export function TableStatusBadge({
  status,
}: {
  status: string;
}) {
  const styles: Record<
    string,
    string
  > = {
    ACTIVE:
      "bg-green-100 text-green-700",

    INACTIVE:
      "bg-neutral-100 text-neutral-700",

    PENDING:
      "bg-yellow-100 text-yellow-700",

    CONFIRMED:
      "bg-blue-100 text-blue-700",

    SHIPPED:
      "bg-purple-100 text-purple-700",

    DELIVERED:
      "bg-green-100 text-green-700",

    CANCELLED:
      "bg-red-100 text-red-700",
  };

  return (
    <span
      className={`inline-flex rounded-full px-4 py-2 text-xs font-medium ${
        styles[
          status
        ] ??
        "bg-neutral-100 text-neutral-700"
      }`}
    >
      {status}
    </span>
  );
}
import Link from "next/link";

type Props = {
  page: number;
  totalPages: number;
  pathname: string;
};

export function TablePagination({ page, totalPages, pathname }: Props) {
  if (totalPages <= 1) {
    return null;
  }

  const hasQuery = pathname.includes("?");
  const joiner = hasQuery ? "&" : "?";

  return (
    <div className="flex items-center justify-between border-t border-neutral-200 p-6">
      <p className="text-sm text-neutral-500">
        Page {page} of {totalPages}
      </p>

      <div className="flex gap-3">
        <Link
          href={`${pathname}${joiner}page=${Math.max(1, page - 1)}`}
          className={`rounded-2xl border px-5 py-3 transition ${
            page === 1 ? "pointer-events-none opacity-50" : "hover:bg-neutral-100"
          }`}
        >
          Previous
        </Link>

        <Link
          href={`${pathname}${joiner}page=${Math.min(totalPages, page + 1)}`}
          className={`rounded-2xl border px-5 py-3 transition ${
            page === totalPages
              ? "pointer-events-none opacity-50"
              : "hover:bg-neutral-100"
          }`}
        >
          Next
        </Link>
      </div>
    </div>
  );
}
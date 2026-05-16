import { Search } from "lucide-react";
import Link from "next/link";

export function TableSearch({
  value = "",
}: {
  value?: string;
}) {
  return (
    <form method="GET" className="relative w-[320px]">
      <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />

      <input
        name="q"
        defaultValue={value}
        placeholder="Search products..."
        className="h-12 w-full rounded-2xl border border-neutral-200 bg-neutral-50 pl-12 pr-4 outline-none transition focus:border-black"
      />

      <button
        type="submit"
        className="sr-only"
      >
        Search
      </button>
    </form>
  );
}
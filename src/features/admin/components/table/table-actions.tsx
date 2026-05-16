"use client";

import Link from "next/link";
import {
  MoreHorizontal,
} from "lucide-react";

export function TableActions({
  editHref,
}: {
  editHref: string;
}) {
  return (
    <Link
      href={editHref}
      className="flex h-11 w-11 items-center justify-center rounded-2xl border border-neutral-200 transition hover:bg-neutral-100"
    >
      <MoreHorizontal className="h-5 w-5" />
    </Link>
  );
}
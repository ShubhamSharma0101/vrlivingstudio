"use client";

import { Search } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

export function TableSearch() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [value, setValue] = useState(
    searchParams.get("search") ?? ""
  );

  function onSubmit(
    e: React.FormEvent<HTMLFormElement>
  ) {
    e.preventDefault();

    const params =
      new URLSearchParams(
        searchParams.toString()
      );

    if (value) {
      params.set("search", value);
    } else {
      params.delete("search");
    }

    params.delete("page");

    router.push(
      `?${params.toString()}`
    );
  }

  return (
    <form
      onSubmit={onSubmit}
      className="relative w-full max-w-md"
    >
      <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />

      <input
        value={value}
        onChange={(e) =>
          setValue(e.target.value)
        }
        placeholder="Search products..."
        className="h-12 w-full rounded-2xl border border-neutral-200 bg-white pl-11 pr-4 text-sm outline-none transition focus:border-black"
      />
    </form>
  );
}
"use client";

import { useRouter, useSearchParams } from "next/navigation";

type Props = {
  param: string;
};

export function TableDateFilter({ param }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const value = searchParams.get(param) ?? "";

  function onChange(
    e: React.ChangeEvent<HTMLInputElement>
  ) {
    const params = new URLSearchParams(
      searchParams.toString()
    );

    const nextValue = e.target.value;

    if (nextValue) {
      params.set(param, nextValue);
    } else {
      params.delete(param);
    }

    params.delete("page");

    router.push(`?${params.toString()}`);
  }

  return (
    <input
      type="date"
      value={value === "today" ? "" : value}
      onChange={onChange}
      className="h-12 rounded-2xl border border-neutral-200 bg-white px-4 text-sm outline-none transition focus:border-black"
    />
  );
}
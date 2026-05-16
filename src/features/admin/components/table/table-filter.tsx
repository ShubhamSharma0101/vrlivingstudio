"use client";

import { useRouter, useSearchParams } from "next/navigation";

type Option = {
  label: string;
  value: string;
};

type Props = {
  param: string;
  placeholder?: string;
  options: Option[];
};

export function TableFilter({
  param,
  placeholder = "Filter",
  options,
}: Props) {
  const router = useRouter();

  const searchParams =
    useSearchParams();

  const value =
    searchParams.get(param) ??
    "";

  function onChange(
    e: React.ChangeEvent<HTMLSelectElement>
  ) {
    const params =
      new URLSearchParams(
        searchParams.toString()
      );

    const nextValue =
      e.target.value;

    if (nextValue) {
      params.set(
        param,
        nextValue
      );
    } else {
      params.delete(param);
    }

    params.delete("page");

    router.push(
      `?${params.toString()}`
    );
  }

  return (
    <select
      value={value}
      onChange={onChange}
      className="h-12 rounded-2xl border border-neutral-200 bg-white px-4 text-sm outline-none transition focus:border-black"
    >
      <option value="">
        {placeholder}
      </option>

      {options.map(
        (option) => (
          <option
            key={option.value}
            value={option.value}
          >
            {option.label}
          </option>
        )
      )}
    </select>
  );
}
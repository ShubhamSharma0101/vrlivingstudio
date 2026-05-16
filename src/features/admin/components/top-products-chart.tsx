"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

type Props = {
  data: {
    name: string;
    quantity: number;
  }[];
};

export function TopProductsChart({
  data,
}: Props) {
  return (
    <div className="h-[350px] rounded-2xl border p-6">
      <h2 className="mb-4 text-xl font-bold">
        Top Products
      </h2>

      <ResponsiveContainer
        width="100%"
        height="100%"
      >
        <BarChart
          data={data}
        >
          <XAxis
            dataKey="name"
          />

          <YAxis />

          <Tooltip />

          <Bar
            dataKey="quantity"
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
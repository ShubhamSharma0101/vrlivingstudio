import { LucideIcon } from "lucide-react";

type Props = {
  title: string;
  value: string;
  subtitle: string;
  icon: LucideIcon;
};

export function DashboardStatCard({
  title,
  value,
  subtitle,
  icon: Icon,
}: Props) {
  return (
    <div className="group relative overflow-hidden rounded-[32px] border border-neutral-200 bg-white p-7 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl">
      {/* glow */}
      <div className="absolute right-0 top-0 h-28 w-28 rounded-full bg-neutral-100 blur-3xl transition group-hover:scale-125" />

      <div className="relative flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-neutral-500">
            {title}
          </p>

          <h3 className="mt-4 text-4xl font-bold tracking-tight">
            {value}
          </h3>

          <p className="mt-3 text-sm text-neutral-500">
            {subtitle}
          </p>
        </div>

        <div className="flex h-16 w-16 items-center justify-center rounded-[24px] bg-black text-white shadow-lg">
          <Icon className="h-7 w-7" />
        </div>
      </div>
    </div>
  );
}
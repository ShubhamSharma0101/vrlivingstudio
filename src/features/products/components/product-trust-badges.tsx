import {
  ShieldCheck,
  Truck,
  RefreshCcw,
} from "lucide-react";

const items = [
  {
    icon: Truck,
    title:
      "Free Shipping",
  },

  {
    icon:
      ShieldCheck,

    title:
      "Secure Payment",
  },

  {
    icon:
      RefreshCcw,

    title:
      "Easy Returns",
  },
];

export function ProductTrustBadges() {
  return (
    <div className="mt-10 grid gap-5 md:grid-cols-3">
      {items.map(
        (item) => {
          const Icon =
            item.icon;

          return (
            <div
              key={
                item.title
              }
              className="rounded-[28px] bg-[#faf8f5] p-6"
            >
              <Icon className="mb-4 h-7 w-7" />

              <p className="font-medium">
                {
                  item.title
                }
              </p>
            </div>
          );
        }
      )}
    </div>
  );
}
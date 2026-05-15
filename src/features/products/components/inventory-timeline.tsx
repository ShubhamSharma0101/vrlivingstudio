import { MovementType } from "@/generated/prisma";

type InventoryItem = {
  id: string;
  quantity: number;
  type: MovementType;
  note: string | null;
  createdAt: Date;
};

export function InventoryTimeline({
  items,
}: {
  items: InventoryItem[];
}) {
  return (
    <div className="space-y-4 rounded-xl border p-6">
      <div>
        <h2 className="text-xl font-semibold">
          Inventory History
        </h2>
      </div>

      <div className="space-y-4">
        {items.map((item) => (
          <div
            key={item.id}
            className="rounded-lg border p-4"
          >
            <div className="flex items-center justify-between">
              <p className="font-medium">
                {item.type}
              </p>

              <p
                className={`font-bold ${
                  item.quantity > 0
                    ? "text-green-600"
                    : "text-red-600"
                }`}
              >
                {item.quantity > 0 ? "+" : ""}
                {item.quantity}
              </p>
            </div>

            <p className="mt-2 text-sm text-muted-foreground">
              {item.note}
            </p>

            <p className="mt-1 text-xs text-muted-foreground">
              {new Date(
                item.createdAt
              ).toLocaleString()}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
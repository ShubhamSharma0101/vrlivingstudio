import { AddToCartButton } from "@/features/cart/components/add-to-cart-button";

type Props = {
  id: string;
  title: string;
  description: string;
  price: number;
  stock: number;
};

export function ProductBuyCard({
  id,
  title,
  description,
  price,
  stock,
}: Props) {
  return (
    <div className="sticky top-28 rounded-[36px] border border-neutral-200 bg-white p-8 shadow-sm">
      <span className="rounded-full bg-neutral-100 px-4 py-2 text-sm font-medium">
        Premium Collection
      </span>

      <h1 className="mt-6 text-4xl font-bold leading-tight">
        {title}
      </h1>

      <p className="mt-5 text-neutral-600">
        {description}
      </p>

      <div className="mt-8 flex items-center justify-between">
        <span className="text-4xl font-bold">
          ₹
          {price.toLocaleString()}
        </span>

        <span
          className={`rounded-full px-4 py-2 text-sm ${
            stock > 0
              ? "bg-green-100 text-green-700"
              : "bg-red-100 text-red-700"
          }`}
        >
          {stock > 0
            ? "In Stock"
            : "Out of Stock"}
        </span>
      </div>

      <div className="mt-8">
        <AddToCartButton
          productId={id}
        />
      </div>
    </div>
  );
}
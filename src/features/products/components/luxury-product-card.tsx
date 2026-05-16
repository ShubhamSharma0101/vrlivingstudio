import Image from "next/image";
import Link from "next/link";

type Props = {
  id: string;
  slug: string;
  title: string;
  price: number;
  category: string;
  image?: string | null;
};

export function LuxuryProductCard({
  slug,
  title,
  price,
  category,
  image,
}: Props) {
  return (
    <Link
      href={`/products/${slug}`}
      className="group"
    >
      <div className="overflow-hidden rounded-[34px] bg-white transition duration-500 hover:-translate-y-2 hover:shadow-2xl">
        {/* Image */}
        <div className="relative h-[420px] overflow-hidden bg-[#f5f5f5]">
          <Image
            src={
              image ??
              "/placeholder.png"
            }
            alt={title}
            fill
            className="object-cover transition duration-700 group-hover:scale-110"
          />

          {/* Badge */}
          <div className="absolute left-5 top-5 rounded-full bg-white px-4 py-2 text-sm font-medium shadow-md">
            Premium
          </div>
        </div>

        {/* Content */}
        <div className="space-y-3 p-6">
          <p className="text-sm uppercase tracking-wider text-neutral-500">
            {category}
          </p>

          <h3 className="text-xl font-semibold leading-tight">
            {title}
          </h3>

          <div className="flex items-center justify-between pt-2">
            <span className="text-2xl font-bold">
              ₹
              {price.toLocaleString()}
            </span>

            <span className="text-sm font-medium transition group-hover:translate-x-1">
              View →
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
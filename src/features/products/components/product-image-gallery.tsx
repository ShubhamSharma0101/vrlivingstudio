import { ProductImageCard } from "./product-image-card";

type ProductImageItem = {
  id: string;
  url: string;
  isPrimary: boolean;
};

export function ProductImageGallery({
  images,
  productId,
}: {
  images: ProductImageItem[];
  productId: string;
}) {
  // ==========================================
  // STEP 6 — PREMIUM EMPTY STATE
  // ==========================================
  if (images.length === 0) {
    return (
      <div className="rounded-[32px] border border-dashed border-neutral-300 bg-[#faf8f5] p-20 text-center">
        <h3 className="text-2xl font-semibold text-neutral-900">
          No Images Uploaded
        </h3>

        <p className="mt-3 text-neutral-500">
          Add beautiful product media to improve conversions.
        </p>
      </div>
    );
  }

  // ==========================================
  // STEP 3 — LUXURY IMAGE GRID
  // ==========================================
  return (
    <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
      {images.map((image) => (
        <ProductImageCard
          key={image.id}
          image={image}
          productId={productId}
        />
      ))}
    </div>
  );
}
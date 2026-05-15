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
  if (images.length === 0) {
    return (
      <div className="rounded-xl border p-6">
        No images uploaded
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
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
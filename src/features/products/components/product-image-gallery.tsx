import Image from "next/image";

type ProductImageItem = {
  id: string;
  url: string;
};

export function ProductImageGallery({
  images,
}: {
  images: ProductImageItem[];
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
        <div
          key={image.id}
          className="relative aspect-square overflow-hidden rounded-xl border"
        >
          <Image
            src={image.url}
            alt="Product"
            fill
            unoptimized
            className="object-cover"
            sizes="(max-width: 768px) 100px, 150px"
          />
        </div>
      ))}
    </div>
  );
}
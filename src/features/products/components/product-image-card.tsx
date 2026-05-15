"use client";

import Image from "next/image";

import { useRouter } from "next/navigation";

import { setPrimaryImage } from "../actions/set-primary-image";

import { deleteProductImage } from "../actions/delete-product-image";

type ProductImageCardProps = {
  image: {
    id: string;
    url: string;
    isPrimary: boolean;
  };

  productId: string;
};

export function ProductImageCard({
  image,
  productId,
}: ProductImageCardProps) {
  const router = useRouter();

  async function handlePrimary() {
    try {
      await setPrimaryImage({
        imageId: image.id,
        productId,
      });

      router.refresh();
    } catch (error) {
      console.error(error);

      alert("Failed to update image");
    }
  }

  async function handleDelete() {
    const confirmed = confirm(
      "Delete this image?"
    );

    if (!confirmed) {
      return;
    }

    try {
      await deleteProductImage({
        imageId: image.id,
        productId,
      });

      router.refresh();
    } catch (error) {
      console.error(error);

      alert("Failed to delete image");
    }
  }

  return (
    <div className="space-y-3 rounded-xl border p-3">
      <div className="relative aspect-square overflow-hidden rounded-lg">
        <Image
          src={image.url}
          alt="Product image"
          fill
          unoptimized
          sizes="(max-width: 768px) 100vw, 50vw"
          className="object-cover"
        />
      </div>

      <div className="space-y-2">
        <button
          onClick={handlePrimary}
          className={`w-full rounded-md px-3 py-2 text-sm ${
            image.isPrimary
              ? "bg-green-600 text-white"
              : "border"
          }`}
        >
          {image.isPrimary
            ? "Primary Image"
            : "Set Primary"}
        </button>

        <button
          onClick={handleDelete}
          className="w-full rounded-md border border-red-500 px-3 py-2 text-sm text-red-500"
        >
          Delete
        </button>
      </div>
    </div>
  );
}
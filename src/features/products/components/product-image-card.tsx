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
    // If the image is already primary, do nothing
    if (image.isPrimary) return;

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
    const confirmed = confirm("Delete this image?");

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
    <div className="group overflow-hidden rounded-[24px] border border-neutral-200 bg-white p-3 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md">
      
      {/* Aspect Ratio Image Container */}
      <div className="relative aspect-square overflow-hidden rounded-[16px] bg-neutral-100">
        <Image
          src={image.url}
          alt="Product image"
          fill
          unoptimized
          sizes="(max-width: 768px) 100vw, 50vw"
          className="object-cover transition duration-500 group-hover:scale-105"
        />

        {/* Minimalist Top Corner Badge if Primary */}
        {image.isPrimary && (
          <div className="absolute left-3 top-3 z-10 rounded-full bg-black px-3 py-1.5 text-[10px] font-semibold uppercase tracking-wider text-white shadow-sm">
            Primary
          </div>
        )}
      </div>

      {/* Modern Compact Button Bar Below Image */}
      <div className="mt-3 flex items-center justify-between gap-2 border-t border-neutral-50 pt-2">
        <button
          onClick={handlePrimary}
          disabled={image.isPrimary}
          title={image.isPrimary ? "This is your primary image" : "Make primary"}
          className={`flex h-9 w-9 items-center justify-center rounded-xl border text-sm transition-all duration-200 ${
            image.isPrimary
              ? "bg-amber-50 border-amber-200 text-amber-500 cursor-default"
              : "border-neutral-200 text-neutral-500 hover:border-black hover:text-black active:scale-95"
          }`}
        >
          {/* Lucide-style Star Icon */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill={image.isPrimary ? "currentColor" : "none"}
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-4 w-4"
          >
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
          </svg>
        </button>

        <button
          onClick={handleDelete}
          title="Delete image"
          className="flex h-9 w-9 items-center justify-center rounded-xl border border-neutral-200 text-neutral-400 hover:border-red-200 hover:bg-red-50 hover:text-red-600 transition-all duration-200 active:scale-95"
        >
          {/* Lucide-style Trash Icon */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-4 w-4"
          >
            <path d="M3 6h18" />
            <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
            <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
          </svg>
        </button>
      </div>
    </div>
  );
}
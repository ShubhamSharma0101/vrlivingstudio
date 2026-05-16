"use client";

import Image from "next/image";
import { useState } from "react";

type ImageType = {
  id: string;
  url: string;
};

export function ProductGallery({
  images,
}: {
  images: ImageType[];
}) {
  const [selectedImage, setSelectedImage] =
    useState(
      images[0]?.url
    );

  return (
    <div className="space-y-5">
      {/* Main Image */}
      <div className="relative aspect-square overflow-hidden rounded-[36px] bg-[#f5f5f5]">
        <Image
          src={
            selectedImage ??
            "/placeholder.png"
          }
          alt="Product"
          fill
          className="object-cover transition duration-500 hover:scale-105"
        />
      </div>

      {/* Thumbnails */}
      <div className="flex gap-4 overflow-x-auto">
        {images.map(
          (image) => (
            <button
              key={image.id}
              onClick={() =>
                setSelectedImage(
                  image.url
                )
              }
              className={`relative h-28 w-28 shrink-0 overflow-hidden rounded-2xl border transition ${
                selectedImage ===
                image.url
                  ? "border-black"
                  : "border-neutral-200"
              }`}
            >
              <Image
                src={image.url}
                alt="Thumbnail"
                fill
                className="object-cover"
              />
            </button>
          )
        )}
      </div>
    </div>
  );
}
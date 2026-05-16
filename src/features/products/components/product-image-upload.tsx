"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { uploadProductImage } from "../actions/upload-image";

// ==========================================
// STEP 1 — PREMIUM MEDIA SHELL
// ==========================================
type Props = {
  children: React.ReactNode;
};

export function ProductMediaManager({
  children,
}: Props) {
  return (
    <section className="rounded-[36px] border border-neutral-200 bg-white p-8 shadow-sm">
      <div className="mb-8">
        <h2 className="text-2xl font-bold">
          Product Media
        </h2>

        <p className="mt-2 text-sm text-neutral-500">
          Upload premium images
          to showcase your product.
        </p>
      </div>

      {children}
    </section>
  );
}

// ==========================================
// UPLOAD ZONE COMPONENT WITH STEP 2 APPLIED
// ==========================================
type UploadedImage = {
  url: string;
};

export function ProductImageUpload({
  onUpload,
}: {
  onUpload: (image: UploadedImage) => Promise<void> | void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter(); // 🌟 Initialized Next.js App Router hooks framework
  
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];

    if (!file) {
      return;
    }

    // 1. Instantly create a local object URL for a responsive client-side UI preview
    const localPreviewUrl = URL.createObjectURL(file);
    setPreview(localPreviewUrl);
    setUploading(true);

    type Props = {
      children: React.ReactNode;
    };

    try {
      // 2. Wrap the binary payload inside a generic FormData object
      const formData = new FormData();
      formData.append("file", file);

      // 3. Dispatch data directly to your hidden Next.js Server Action node
      const result = await uploadProductImage(formData);

      if (!result.success || !result.url) {
        throw new Error(result.error || "Upload failed internally on server");
      }

      // 4. Fire the callback to hit the database layer (`addProductImage`)
      await onUpload({ url: result.url });

      // 5. 🌟 Clear fields and force server synchronization data refresh loops
      setPreview(null); 
      if (inputRef.current) {
        inputRef.current.value = ""; // Resets the actual file picker input field UI
      }
      
      router.refresh(); // Tells Next.js server components to re-run and grab your new database entry!

    } catch (error) {
      console.error("Storage error:", error);
      alert("Image upload failed. Please try again.");
      
      // Revoke preview if backend rejected it to keep state predictable
      setPreview(null);
    } finally {
      setUploading(false);
    }
  }

  return (
    /* STEP 2 — PREMIUM UPLOAD ZONE WRAPPER */
    <div className="group relative overflow-hidden rounded-[32px] border-2 border-dashed border-neutral-300 bg-[#faf8f5] p-12 text-center transition hover:border-black">
      <div className="absolute right-0 top-0 h-36 w-36 rounded-full bg-neutral-200 blur-3xl transition group-hover:scale-125" />

      <div className="relative">
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-[28px] bg-black text-4xl text-white shadow-lg">
          ↑
        </div>

        <h3 className="mt-6 text-2xl font-bold">
          Upload Product Images
        </h3>

        <p className="mx-auto mt-3 max-w-md text-neutral-500">
          Drag and drop images here or click below to upload premium product media.
        </p>

        <div className="mt-8 flex flex-col items-center justify-center space-y-4">
          {/* existing upload button & elements */}
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            onChange={handleUpload}
            disabled={uploading}
            className="block w-full max-w-xs text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-black file:text-white hover:file:opacity-90 disabled:opacity-50 cursor-pointer mx-auto"
          />

          {uploading && (
            <p className="text-sm text-neutral-500 animate-pulse">
              Uploading asset to storage ecosystem...
            </p>
          )}

          {preview && (
            <div className="relative h-40 w-40 overflow-hidden rounded-2xl border bg-neutral-100 shadow-md mx-auto">
              <Image
                src={preview}
                alt="Product Asset Preview"
                fill
                sizes="160px"
                className={`object-cover ${uploading ? "opacity-50 grayscale animate-pulse" : ""}`}
                priority
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { uploadProductImage } from "../actions/upload-image";

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
    <div className="space-y-4">
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        onChange={handleUpload}
        disabled={uploading}
        className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-primary-foreground hover:file:opacity-90 disabled:opacity-50 cursor-pointer"
      />

      {uploading && (
        <p className="text-sm text-muted-foreground animate-pulse">
          Uploading asset to storage ecosystem...
        </p>
      )}

      {preview && (
        <div className="relative h-40 w-40 overflow-hidden rounded-lg border bg-muted">
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
  );
}
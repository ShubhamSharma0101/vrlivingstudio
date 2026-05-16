"use server";

import { createClient } from "@supabase/supabase-js";
import { revalidateTag } from "next/cache";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabaseServer = createClient(supabaseUrl, supabaseServiceKey, {
  auth: { persistSession: false }
});

export async function uploadProductImage(formData: FormData) {
  try {
    const file = formData.get("file") as File;
    if (!file) throw new Error("No file found");

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const fileName = `${Date.now()}-${file.name}`;
    
    const { data, error } = await supabaseServer.storage
      .from("vrlivingstudio-bucket")
      .upload(fileName, buffer, {
        contentType: file.type,
      });

    if (error) throw error;

    const { data: urlData } = supabaseServer.storage
      .from("vrlivingstudio-bucket")
      .getPublicUrl(data.path);

    return { success: true, url: urlData.publicUrl };
  } catch (error: unknown) {
    // Safely parse the unknown error type
    let errorMessage = "Upload failed";

    if (error instanceof Error) {
      errorMessage = error.message;
    } else if (error && typeof error === "object" && "message" in error) {
      errorMessage = String(error.message);
    }


      revalidateTag("products", "max");
revalidateTag("categories", "max");

    return { success: false, error: errorMessage };
  }
}
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      // 1. Strict, secure pattern matching for your dedicated Supabase Media Bucket
      {
        protocol: "https",
        hostname: "ywggvrbrldktjxznvcpc.supabase.co",
        port: "",
        pathname: "/storage/v1/object/public/vrlivingstudio-bucket/**",
      },
      // 2. Added support for UploadThing (utfs.io) asset loading pipelines
      {
        protocol: "https",
        hostname: "utfs.io",
        port: "",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
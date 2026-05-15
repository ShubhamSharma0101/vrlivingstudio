import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "ywggvrbrldktjxznvcpc.supabase.co",
        port: "",
        pathname: "/storage/v1/object/public/vrlivingstudio-bucket/**",
      },
    ],
  },
};

export default nextConfig;
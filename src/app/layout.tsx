import type { Metadata } from "next";
import Script from "next/script";
import Link from "next/link";
import {
  ClerkProvider,
  SignInButton,
  SignUpButton,
  UserButton,
  Show,
} from "@clerk/nextjs";

import "./globals.css";


export const metadata: Metadata = {
  metadataBase: new URL(
    "https://vrlivingstudio.com"
  ),

  title: {
    default:
      "VR Living Studio",

    template:
      "%s | VR Living Studio",
  },

  description:
    "Premium furniture and living studio products from VR Living Studio.",

  keywords: [
    "Furniture",
    "Home Decor",
    "Living Room",
    "Modern Furniture",
    "VR Living Studio",
  ],

  openGraph: {
    title:
      "VR Living Studio",

    description:
      "Premium furniture and living studio products.",

    url:
      "https://vrlivingstudio.com",

    siteName:
      "VR Living Studio",

    images: [
      {
        url: "/og-image.jpg",

        width: 1200,

        height: 630,

        alt:
          "VR Living Studio",
      },
    ],

    locale:
      "en_IN",

    type:
      "website",
  },

  twitter: {
    card:
      "summary_large_image",

    title:
      "VR Living Studio",

    description:
      "Premium furniture and decor products.",

    images: [
      "/og-image.jpg",
    ],
  },

  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning>
        <ClerkProvider>
         <Script src="https://checkout.razorpay.com/v1/checkout.js" />



          <header className="flex items-center justify-between border-b p-4">
            <h1 className="font-bold">
              VR Living Studio
            </h1>

            <div className="flex items-center gap-4">
              <Link href="/products">
                Products
              </Link>
              <Link href="/orders">
                My Orders
              </Link>
              <Link href="/cart">
                Cart
              </Link>
              <Show when="signed-out">
                <SignInButton />
                <SignUpButton />
              </Show>

              <Show when="signed-in">
                <UserButton />
              </Show>
            </div>
          </header>

          {children}
        </ClerkProvider>
      </body>
    </html>
  );
}
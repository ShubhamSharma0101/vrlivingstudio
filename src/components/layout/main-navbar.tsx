"use client";

import Link from "next/link";
import { Search, ShoppingCart, Package } from "lucide-react";
import { Show, SignInButton, UserButton } from "@clerk/nextjs";

export function MainNavbar() {
  return (
    <header className="sticky top-0 z-50 border-b bg-white/95 backdrop-blur">
      <div className="container mx-auto flex h-20 items-center justify-between px-4">
        <Link href="/" className="text-2xl font-bold tracking-tight text-black">
          VR Living Studio
        </Link>

        <nav className="hidden items-center gap-8 lg:flex">
          <Link href="/" className="text-sm font-medium text-neutral-600 transition hover:text-black">
            Home
          </Link>
          <Link href="/products" className="text-sm font-medium text-neutral-600 transition hover:text-black">
            Shop
          </Link>
          <Link href="/products" className="text-sm font-medium text-neutral-600 transition hover:text-black">
            Collections
          </Link>
          <Link href="/about" className="text-sm font-medium text-neutral-600 transition hover:text-black">
            About
          </Link>
          <Link href="/contact" className="text-sm font-medium text-neutral-600 transition hover:text-black">
            Contact
          </Link>
        </nav>

        <div className="flex items-center gap-5">
          <button className="text-neutral-600 transition hover:text-black">
            <Search className="h-5 w-5" />
          </button>

          <Show when="signed-in">
            <div className="flex items-center gap-5">
              <Link href="/orders" className="text-neutral-600 transition hover:text-black">
                <Package className="h-5 w-5" />
              </Link>

              <Link href="/cart" className="text-neutral-600 transition hover:text-black">
                <ShoppingCart className="h-5 w-5" />
              </Link>

              <UserButton
                appearance={{
                  elements: {
                    avatarBox: "h-8 w-8",
                  },
                }}
              />
            </div>
          </Show>

         <Show when="signed-out">
          <SignInButton mode="modal">
            <button className="rounded-full bg-black px-4 py-2 text-xs font-semibold text-white transition hover:bg-neutral-800">
              Sign In
            </button>
          </SignInButton>
        </Show>
        </div>
      </div>
    </header>
  );
}
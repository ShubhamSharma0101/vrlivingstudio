import Link from "next/link";

import {
  Search,
  ShoppingCart,
  User,
  Package,
} from "lucide-react";

import { getCurrentUser } from "@/lib/auth";

export async function MainNavbar() {
  const user =
    await getCurrentUser();

  return (
    <header className="sticky top-0 z-50 border-b bg-white/95 backdrop-blur">
      <div className="container mx-auto flex h-20 items-center justify-between px-4">
        {/* Logo */}
        <Link
          href="/"
          className="text-2xl font-bold tracking-tight"
        >
          VR Living Studio
        </Link>

        {/* Nav */}
        <nav className="hidden items-center gap-8 lg:flex">
          <Link href="/">
            Home
          </Link>

          <Link href="/products">
            Shop
          </Link>

          <Link href="/products">
            Collections
          </Link>

          <Link href="/about">
            About
          </Link>

          <Link href="/contact">
            Contact
          </Link>
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-5">
          <button>
            <Search className="h-5 w-5" />
          </button>

          {user && (
            <>
              <Link href="/orders">
                <Package className="h-5 w-5" />
              </Link>

              <Link href="/cart">
                <ShoppingCart className="h-5 w-5" />
              </Link>
            </>
          )}

          <Link href="/profile">
            <User className="h-5 w-5" />
          </Link>
        </div>
      </div>
    </header>
  );
}
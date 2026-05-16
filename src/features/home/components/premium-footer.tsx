import Link from "next/link";

export function PremiumFooter() {
  return (
    <footer className="bg-[#111111] py-20 text-white">
      <div className="container mx-auto grid gap-12 px-4 md:grid-cols-4">
        <div>
          <h3 className="text-2xl font-bold">
            VR Living Studio
          </h3>

          <p className="mt-4 text-neutral-400">
            Premium furniture and luxury
            living experiences crafted
            for modern homes.
          </p>
        </div>

        <div>
          <h4 className="mb-4 font-semibold">
            Shop
          </h4>

          <div className="space-y-2 text-neutral-400">
            <Link href="/products">
              Products
            </Link>
          </div>
        </div>

        <div>
          <h4 className="mb-4 font-semibold">
            Support
          </h4>

          <div className="space-y-2 text-neutral-400">
            <p>
              support@vrlivingstudio.com
            </p>

            <p>
              +91 98765 43210
            </p>
          </div>
        </div>

        <div>
          <h4 className="mb-4 font-semibold">
            Legal
          </h4>

          <div className="space-y-2 text-neutral-400">
            <Link href="/">
              Privacy Policy
            </Link>

            <Link href="/">
              Terms
            </Link>
          </div>
        </div>
      </div>

      <div className="container mx-auto mt-16 border-t border-neutral-800 pt-8 px-4 text-sm text-neutral-500">
        © 2026 VR Living Studio.
        All rights reserved.
      </div>
    </footer>
  );
}
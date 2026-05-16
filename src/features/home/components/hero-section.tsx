import Link from "next/link";

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-[#f7f3ef]">
      <div className="container mx-auto grid min-h-[85vh] items-center gap-12 px-4 py-20 lg:grid-cols-2">
        {/* Content */}
        <div className="max-w-2xl">
          <span className="mb-5 inline-block rounded-full border border-neutral-300 bg-white px-4 py-2 text-sm font-medium">
            Elevate Your Living Space
          </span>

          <h1 className="text-5xl font-bold leading-tight tracking-tight text-neutral-900 md:text-6xl xl:text-7xl">
            Luxury Living
            <br />
            Starts At Home
          </h1>

          <p className="mt-8 max-w-xl text-lg leading-8 text-neutral-600">
            Discover premium furniture,
            modern décor, and timeless
            interiors crafted to redefine
            your everyday living.
          </p>

          <div className="mt-10 flex flex-wrap gap-4">
            <Link
              href="/products"
              className="rounded-xl bg-black px-8 py-4 text-white transition hover:opacity-90"
            >
              Shop Collection
            </Link>

            <Link
              href="/products"
              className="rounded-xl border border-neutral-300 bg-white px-8 py-4 transition hover:bg-neutral-100"
            >
              Explore Designs
            </Link>
          </div>

          {/* Trust */}
          <div className="mt-14 flex flex-wrap gap-8 text-sm text-neutral-600">
            <div>
              <p className="text-2xl font-bold text-black">
                5K+
              </p>
              Happy Customers
            </div>

            <div>
              <p className="text-2xl font-bold text-black">
                100+
              </p>
              Premium Products
            </div>

            <div>
              <p className="text-2xl font-bold text-black">
                24/7
              </p>
              Support
            </div>
          </div>
        </div>

        {/* Image */}
        <div className="relative">
          <div className="absolute -left-10 top-10 h-40 w-40 rounded-full bg-[#d9c5b2] blur-[100px]" />

          <div className="overflow-hidden rounded-[40px] shadow-2xl">
            <img
              src="https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?q=80&w=1600&auto=format&fit=crop"
              alt="Luxury Living Room"
              className="h-[700px] w-full object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
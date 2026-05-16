import Link from "next/link";

const categories = [
  {
    title: "Living Room",
    image:
      "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?q=80&w=1200&auto=format&fit=crop",
  },

  {
    title: "Bedroom",
    image:
      "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?q=80&w=1200&auto=format&fit=crop",
  },

  {
    title: "Dining",
    image:
      "https://images.unsplash.com/photo-1484101403633-562f891dc89a?q=80&w=1200&auto=format&fit=crop",
  },
];

export function FeaturedCategories() {
  return (
    <section className="bg-white py-24">
      <div className="container mx-auto px-4">
        <div className="mb-14 text-center">
          <p className="mb-3 text-sm uppercase tracking-[0.25em] text-neutral-500">
            Curated Spaces
          </p>

          <h2 className="text-4xl font-bold md:text-5xl">
            Shop By Collection
          </h2>

          <p className="mx-auto mt-4 max-w-2xl text-neutral-600">
            Explore beautifully crafted
            collections tailored for
            every room in your home.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          {categories.map(
            (category) => (
              <Link
                href="/products"
                key={
                  category.title
                }
                className="group overflow-hidden rounded-[36px]"
              >
                <div className="relative overflow-hidden">
                  <img
                    src={
                      category.image
                    }
                    alt={
                      category.title
                    }
                    className="h-[520px] w-full object-cover transition duration-700 group-hover:scale-110"
                  />

                  <div className="absolute inset-0 bg-black/20" />

                  <div className="absolute bottom-8 left-8">
                    <h3 className="text-3xl font-bold text-white">
                      {
                        category.title
                      }
                    </h3>

                    <span className="mt-2 inline-block text-sm text-white/90">
                      Explore →
                    </span>
                  </div>
                </div>
              </Link>
            )
          )}
        </div>
      </div>
    </section>
  );
}
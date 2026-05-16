import { LuxuryProductCard } from "./luxury-product-card";

type Product = {
  id: string;
  slug: string;
  title: string;
  price: string;
  category: {
    name: string;
  };

  images: {
    url: string;
  }[];
};

export function RelatedProducts({
  products,
}: {
  products: Product[];
}) {
  if (
    products.length ===
    0
  ) {
    return null;
  }

  return (
    <section className="mt-32">
      <div className="mb-14 text-center">
        <p className="mb-3 text-sm uppercase tracking-[0.25em] text-neutral-500">
          Curated For You
        </p>

        <h2 className="text-4xl font-bold">
          You May Also Like
        </h2>
      </div>

      <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-4">
        {products.map(
          (product) => (
            <LuxuryProductCard
              key={
                product.id
              }
              id={
                product.id
              }
              slug={
                product.slug
              }
              title={
                product.title
              }
              price={Number(
                product.price
              )}
              category={
                product
                  .category
                  .name
              }
              image={
                product
                  .images[0]
                  ?.url
              }
            />
          )
        )}
      </div>
    </section>
  );
}
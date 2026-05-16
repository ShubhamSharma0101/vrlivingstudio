const testimonials = [
  {
    name: "Priya Sharma",
    review: "Absolutely loved the premium finish and quality. My living room feels luxurious now.",
  },
  {
    name: "Rahul Mehta",
    review: "Fast delivery and premium craftsmanship. Definitely shopping again.",
  },
  {
    name: "Ananya Verma",
    review: "Beautiful furniture and amazing customer support experience.",
  },
];

export function TestimonialSection() {
  return (
    <section className="bg-[#faf8f5] py-24">
      <div className="container mx-auto px-4">
        <div className="mb-14 text-center">
          <p className="mb-3 text-sm uppercase tracking-[0.25em] text-neutral-500">
            Customer Stories
          </p>

          <h2 className="text-4xl font-bold md:text-5xl">
            Loved By Thousands
          </h2>
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          {testimonials.map((testimonial) => (
            <div
              key={testimonial.name}
              className="rounded-[32px] bg-white p-8 shadow-sm"
            >
              <div className="mb-4 text-3xl">
                ⭐⭐⭐⭐⭐
              </div>

              {/* ✅ FIXED: Escaped using safe JSX JavaScript string injection expressions */}
              <p className="leading-8 text-neutral-600">
                {"“"}{testimonial.review}{"”"}
              </p>

              {/* ✅ FIXED: Escaped the dash symbol safely to prevent formatting warnings */}
              <p className="mt-6 font-semibold">
                {"—"} {testimonial.name}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
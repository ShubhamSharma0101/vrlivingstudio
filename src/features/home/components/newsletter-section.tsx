export function NewsletterSection() {
  return (
    <section className="bg-black py-24 text-white">
      <div className="container mx-auto max-w-4xl px-4 text-center">
        <p className="mb-3 text-sm uppercase tracking-[0.25em] text-neutral-400">
          Stay Inspired
        </p>

        <h2 className="text-4xl font-bold md:text-5xl">
          Get Interior Inspiration
          Delivered
        </h2>

        <p className="mx-auto mt-5 max-w-2xl text-neutral-300">
          Receive curated home décor ideas,
          premium collections, and exclusive
          offers.
        </p>

        <div className="mx-auto mt-10 flex max-w-xl flex-col gap-4 sm:flex-row">
          <input
            placeholder="Enter your email"
            className="h-14 flex-1 rounded-xl border border-neutral-700 bg-neutral-900 px-5 text-white outline-none"
          />

          <button className="rounded-xl bg-white px-8 text-black transition hover:bg-neutral-200">
            Subscribe
          </button>
        </div>
      </div>
    </section>
  );
}
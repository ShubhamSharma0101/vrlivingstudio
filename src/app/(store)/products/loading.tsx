export default function ProductsLoading() {
  return (
    <div className="container mx-auto py-10">
      <div className="mb-8 h-10 w-48 animate-pulse rounded bg-muted" />

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {Array.from({
          length: 8,
        }).map((_, index) => (
          <div
            key={index}
            className="rounded-2xl border p-4"
          >
            <div className="mb-4 h-52 animate-pulse rounded-xl bg-muted" />

            <div className="mb-2 h-6 animate-pulse rounded bg-muted" />

            <div className="h-4 w-24 animate-pulse rounded bg-muted" />
          </div>
        ))}
      </div>
    </div>
  );
}
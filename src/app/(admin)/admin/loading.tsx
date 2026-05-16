export default function AdminLoading() {
  return (
    <div className="space-y-8">
      <div className="h-10 w-56 animate-pulse rounded bg-muted" />

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        {Array.from({
          length: 4,
        }).map((_, i) => (
          <div
            key={i}
            className="h-40 animate-pulse rounded-2xl bg-muted"
          />
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="h-[350px] animate-pulse rounded-2xl bg-muted" />

        <div className="h-[350px] animate-pulse rounded-2xl bg-muted" />
      </div>
    </div>
  );
}
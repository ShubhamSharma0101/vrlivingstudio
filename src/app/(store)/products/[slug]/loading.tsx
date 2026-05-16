export default function ProductLoading() {
  return (
    <div className="container mx-auto py-10">
      <div className="grid gap-10 lg:grid-cols-2">
        <div className="h-[500px] animate-pulse rounded-2xl bg-muted" />

        <div className="space-y-5">
          <div className="h-12 animate-pulse rounded bg-muted" />

          <div className="h-6 w-32 animate-pulse rounded bg-muted" />

          <div className="space-y-2">
            <div className="h-4 animate-pulse rounded bg-muted" />
            <div className="h-4 animate-pulse rounded bg-muted" />
            <div className="h-4 w-3/4 animate-pulse rounded bg-muted" />
          </div>

          <div className="h-12 w-48 animate-pulse rounded-xl bg-muted" />
        </div>
      </div>
    </div>
  );
}
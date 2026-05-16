export function AdminProductFormShell({
  title,
  description,
  children,
  sidebar,
}: {
  title: string;
  description: string;
  children: React.ReactNode;
  sidebar: React.ReactNode;
}) {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-bold tracking-tight">
          {title}
        </h1>

        <p className="mt-2 text-neutral-500">
          {description}
        </p>
      </div>

      <div className="grid gap-8 xl:grid-cols-[1fr_360px]">
        <div className="space-y-8">
          {children}
        </div>

        <aside className="sticky top-28 h-fit">
          {sidebar}
        </aside>
      </div>
    </div>
  );
}
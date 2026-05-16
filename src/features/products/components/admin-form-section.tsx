export function AdminFormSection({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-[36px] border border-neutral-200 bg-white p-8 shadow-sm">
      <div className="mb-8">
        <h2 className="text-2xl font-bold">
          {title}
        </h2>

        {description && (
          <p className="mt-2 text-sm text-neutral-500">
            {description}
          </p>
        )}
      </div>

      <div className="space-y-6">
        {children}
      </div>
    </section>
  );
}
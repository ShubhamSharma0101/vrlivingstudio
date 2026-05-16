export function TableContainer({
  title,
  description,
  actions,
  children,
}: {
  title: string;
  description?: string;
  actions?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="overflow-hidden rounded-[36px] border border-neutral-200 bg-white shadow-sm">
      <div className="flex items-center justify-between border-b border-neutral-200 p-8">
        <div>
          <h1 className="text-2xl font-bold">
            {title}
          </h1>

          {description && (
            <p className="mt-1 text-sm text-neutral-500">
              {description}
            </p>
          )}
        </div>

        {actions}
      </div>

      <div className="overflow-x-auto">
        {children}
      </div>
    </div>
  );
}
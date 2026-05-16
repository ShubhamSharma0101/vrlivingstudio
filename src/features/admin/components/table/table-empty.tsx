export function TableEmpty({
  title,
}: {
  title: string;
}) {
  return (
    <div className="p-20 text-center">
      <h2 className="text-2xl font-semibold">
        No {title} Found
      </h2>

      <p className="mt-2 text-neutral-500">
        Nothing available yet.
      </p>
    </div>
  );
}
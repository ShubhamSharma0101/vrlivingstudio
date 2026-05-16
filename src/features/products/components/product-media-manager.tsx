type Props = {
  children: React.ReactNode;
};

export function ProductMediaManager({
  children,
}: Props) {
  return (
    <section className="rounded-[36px] border border-neutral-200 bg-white p-8 shadow-sm">
      <div className="mb-8">
        <h2 className="text-2xl font-bold">
          Product Media
        </h2>

        <p className="mt-2 text-sm text-neutral-500">
          Upload premium images
          to showcase your product.
        </p>
      </div>

      {children}
    </section>
  );
}
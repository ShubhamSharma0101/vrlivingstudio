import { StorefrontHeader } from "@/components/layout/storefront-header";

export default function StoreLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <StorefrontHeader />

      <main>
        {children}
      </main>
    </>
  );
}
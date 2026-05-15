import { UserButton } from "@clerk/nextjs";

export function AdminHeader() {
  return (
    <header className="flex h-16 items-center justify-between border-b bg-white px-6">
      <div>
        <h1 className="text-lg font-semibold">
          Admin Dashboard
        </h1>
      </div>

      <UserButton />
    </header>
  );
}
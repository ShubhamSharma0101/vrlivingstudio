import { Bell } from "lucide-react";

import { getCurrentUser } from "@/lib/auth";

export async function AdminTopbar() {
  const user =
    await getCurrentUser();

  return (
    <header className="flex h-20 items-center justify-between border-b border-neutral-200 bg-white px-8">
      <div>
        <h1 className="text-2xl font-bold">
          Dashboard
        </h1>

        <p className="text-sm text-neutral-500">
          Welcome back,
          {" "}
          {user?.name}
        </p>
      </div>

      <div className="flex items-center gap-5">
        <button className="flex h-12 w-12 items-center justify-center rounded-2xl border border-neutral-200">
          <Bell className="h-5 w-5" />
        </button>

        <div className="rounded-2xl bg-black px-5 py-3 text-white">
          {user?.role}
        </div>
      </div>
    </header>
  );
}
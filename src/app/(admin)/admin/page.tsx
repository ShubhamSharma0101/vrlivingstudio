import { redirect } from "next/navigation";

import { getCurrentUser } from "@/lib/auth";

export default async function AdminPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/");
  }

  if (user.role !== "ADMIN") {
    redirect("/");
  }

  return (
    <main className="p-10">
      <h1 className="text-3xl font-bold">
        Admin Dashboard
      </h1>

      <p className="mt-4">
        Welcome Admin
      </p>
    </main>
  );
}
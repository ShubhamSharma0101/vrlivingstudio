import { redirect } from "next/navigation";

import { getCurrentUser } from "@/lib/auth";

export default async function DashboardPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/");
  }

  return (
    <main className="p-10">
      <h1 className="text-3xl font-bold">
        Customer Dashboard
      </h1>

      <p className="mt-4">
        Welcome {user.name}
      </p>
    </main>
  );
}
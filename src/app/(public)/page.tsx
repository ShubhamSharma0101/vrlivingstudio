import { getCurrentUser } from "@/lib/auth";

export default async function HomePage() {
  const user = await getCurrentUser();

  return (
    <main className="p-10">
      <h1 className="text-3xl font-bold">
        VR Living Studio
      </h1>

      {user ? (
        <div className="mt-6 space-y-2">
          <p>
            Logged in as:
          </p>

          <p>{user.email}</p>

          <p>{user.name}</p>

          <p>{user.role}</p>
        </div>
      ) : (
        <p className="mt-6">
          Not signed in
        </p>
      )}
    </main>
  );
}
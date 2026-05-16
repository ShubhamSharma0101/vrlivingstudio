import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="text-center">
        <h1 className="text-5xl font-bold">
          404
        </h1>

        <p className="mt-3 text-muted-foreground">
          Page not found
        </p>

        <Link
          href="/"
          className="mt-6 inline-block rounded-md bg-black px-6 py-3 text-white"
        >
          Go Home
        </Link>
      </div>
    </div>
  );
}
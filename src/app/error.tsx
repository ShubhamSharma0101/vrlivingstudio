"use client";

export default function Error({
  error,
  reset,
}: {
  error: Error;

  reset: () => void;
}) {
  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="max-w-md text-center">
        <h1 className="text-3xl font-bold">
          Something went wrong
        </h1>

        <p className="mt-3 text-muted-foreground">
          We encountered an unexpected issue.
        </p>

        <button
          onClick={reset}
          className="mt-6 rounded-md bg-black px-6 py-3 text-white"
        >
          Try Again
        </button>
      </div>
    </div>
  );
}
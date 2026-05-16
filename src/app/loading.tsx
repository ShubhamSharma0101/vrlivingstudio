export default function Loading() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="space-y-4 text-center">
        <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-black border-t-transparent" />

        <p className="text-sm text-muted-foreground">
          Loading VR Living Studio...
        </p>
      </div>
    </div>
  );
}
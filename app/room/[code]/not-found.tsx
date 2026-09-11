import Link from "next/link";

export default function RoomNotFound() {
  return (
    <main className="flex min-h-dvh flex-col items-center justify-center gap-3 px-4 text-center">
      <p className="font-mono text-sm text-neutral-500">404</p>
      <h1 className="text-2xl font-semibold">Room not found</h1>
      <p className="max-w-sm text-sm text-neutral-500">
        Double-check the code or ask for a fresh invite link.
      </p>
      <Link
        href="/"
        className="mt-2 rounded-lg bg-sky-600 px-4 py-2 text-sm font-medium text-white hover:bg-sky-500"
      >
        Back to home
      </Link>
    </main>
  );
}

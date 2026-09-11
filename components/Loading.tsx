export function Loading({ label = "Loading…" }: { label?: string }) {
  return (
    <div className="flex h-dvh w-full flex-col items-center justify-center gap-3 text-sm text-neutral-500">
      <div className="size-6 animate-spin rounded-full border-2 border-neutral-300 border-t-sky-500 dark:border-neutral-700 dark:border-t-sky-400" />
      {label}
    </div>
  );
}

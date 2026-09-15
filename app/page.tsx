"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState, type FormEvent } from "react";
import { ThemeToggle } from "@/components/ThemeToggle";
import { getIdentity, MAX_NAME_LENGTH, saveName } from "@/lib/identity";
import { normalizeCode } from "@/lib/rooms";

const inputClass =
  "w-full rounded-lg border border-neutral-300 bg-white px-3 py-2 text-sm outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-500/30 dark:border-neutral-700 dark:bg-neutral-900";

const primaryButton =
  "inline-flex cursor-pointer items-center justify-center rounded-lg bg-sky-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-sky-500 disabled:cursor-not-allowed disabled:opacity-60";

const secondaryButton =
  "inline-flex cursor-pointer items-center justify-center rounded-lg border border-neutral-300 bg-white px-4 py-2 text-sm font-medium transition hover:bg-neutral-100 disabled:cursor-not-allowed disabled:opacity-60 dark:border-neutral-700 dark:bg-neutral-900 dark:hover:bg-neutral-800";

async function readError(response: Response, fallback: string) {
  try {
    const data = await response.json();
    return typeof data.error === "string" ? data.error : fallback;
  } catch {
    return fallback;
  }
}

export default function Home() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const [pending, setPending] = useState<"create" | "join" | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const identity = getIdentity();
    // localStorage is client-only, so it's read after hydration.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (identity) setName(identity.name);
  }, []);

  function requireName() {
    if (!name.trim()) {
      setError("Enter your name first.");
      document.getElementById("name")?.focus();
      return false;
    }
    saveName(name);
    return true;
  }

  async function createRoom() {
    setError(null);
    if (!requireName()) return;
    setPending("create");
    try {
      const response = await fetch("/api/rooms", { method: "POST" });
      if (!response.ok) {
        throw new Error(await readError(response, "Could not create room."));
      }
      const { code } = (await response.json()) as { code: string };
      router.push(`/room/${code}`);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not create room.");
      setPending(null);
    }
  }

  async function joinRoom(event: FormEvent) {
    event.preventDefault();
    setError(null);
    if (!requireName()) return;
    const normalized = normalizeCode(code);
    if (!normalized) {
      setError("That doesn't look like a room code (e.g. k7x-92p).");
      return;
    }
    setPending("join");
    try {
      const response = await fetch(`/api/rooms/${normalized}`);
      if (!response.ok) {
        throw new Error(
          response.status === 404
            ? `No room found with code ${normalized}.`
            : await readError(response, "Could not join room.")
        );
      }
      router.push(`/room/${normalized}`);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not join room.");
      setPending(null);
    }
  }

  return (
    <main className="relative flex min-h-dvh flex-col items-center justify-center px-4 py-12">
      <ThemeToggle className="absolute right-4 top-4" />

      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex size-12 items-center justify-center rounded-xl bg-sky-600 text-white shadow-lg shadow-sky-600/30">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="size-6">
              <rect x="3" y="3" width="7" height="5" rx="1" />
              <rect x="14" y="16" width="7" height="5" rx="1" />
              <path d="M6.5 8v4.5a2 2 0 0 0 2 2h8v1.5" />
            </svg>
          </div>
          <h1 className="text-3xl font-semibold tracking-tight">FloJam</h1>
          <p className="mt-2 text-neutral-600 dark:text-neutral-400">
            Sketch diagrams together, in real time.
          </p>
        </div>

        <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm dark:border-neutral-800 dark:bg-neutral-900/60">
          <label htmlFor="name" className="mb-1.5 block text-sm font-medium">
            Your name
          </label>
          <input
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            maxLength={MAX_NAME_LENGTH}
            placeholder="e.g. Ada Lovelace"
            autoComplete="nickname"
            className={inputClass}
          />

          <button
            type="button"
            onClick={createRoom}
            disabled={pending !== null}
            className={`${primaryButton} mt-4 w-full`}
          >
            {pending === "create" ? "Creating room…" : "Create a new room"}
          </button>

          <div className="my-5 flex items-center gap-3 text-xs uppercase tracking-wide text-neutral-400">
            <div className="h-px flex-1 bg-neutral-200 dark:bg-neutral-800" />
            or join one
            <div className="h-px flex-1 bg-neutral-200 dark:bg-neutral-800" />
          </div>

          <form onSubmit={joinRoom} className="flex flex-col gap-2 sm:flex-row">
            <label htmlFor="code" className="sr-only">
              Room code or invite link
            </label>
            <input
              id="code"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="Room code or invite link"
              autoComplete="off"
              spellCheck={false}
              className={`${inputClass} font-mono`}
            />
            <button
              type="submit"
              disabled={pending !== null}
              className={`${secondaryButton} shrink-0`}
            >
              {pending === "join" ? "Joining…" : "Join"}
            </button>
          </form>

          {error && (
            <p role="alert" className="mt-4 text-sm text-red-600 dark:text-red-400">
              {error}
            </p>
          )}
        </div>

        <p className="mt-6 text-center text-xs text-neutral-500">
          Built with Next.js, React Flow and Liveblocks.
        </p>
      </div>
    </main>
  );
}

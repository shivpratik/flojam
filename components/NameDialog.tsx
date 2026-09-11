"use client";

import Link from "next/link";
import { useState, type FormEvent } from "react";
import { MAX_NAME_LENGTH } from "@/lib/identity";

export function NameDialog({
  code,
  onSubmit,
}: {
  code: string;
  onSubmit: (name: string) => void;
}) {
  const [name, setName] = useState("");

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    if (name.trim()) onSubmit(name);
  }

  return (
    <main className="flex min-h-dvh items-center justify-center px-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm dark:border-neutral-800 dark:bg-neutral-900/60"
      >
        <p className="text-sm text-neutral-500">You&apos;re joining room</p>
        <h1 className="mb-5 font-mono text-2xl font-semibold">{code}</h1>
        <label htmlFor="name" className="mb-1.5 block text-sm font-medium">
          What should others call you?
        </label>
        <input
          id="name"
          autoFocus
          value={name}
          onChange={(e) => setName(e.target.value)}
          maxLength={MAX_NAME_LENGTH}
          placeholder="Your name"
          autoComplete="nickname"
          className="w-full rounded-lg border border-neutral-300 bg-white px-3 py-2 text-sm outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-500/30 dark:border-neutral-700 dark:bg-neutral-900"
        />
        <button
          type="submit"
          disabled={!name.trim()}
          className="mt-4 w-full cursor-pointer rounded-lg bg-sky-600 px-4 py-2 text-sm font-medium text-white hover:bg-sky-500 disabled:cursor-not-allowed disabled:opacity-60"
        >
          Join room
        </button>
        <Link
          href="/"
          className="mt-3 block text-center text-xs text-neutral-500 hover:underline"
        >
          Back to home
        </Link>
      </form>
    </main>
  );
}

"use client";

import { useStatus } from "@liveblocks/react/suspense";
import Link from "next/link";
import { useEffect, useState } from "react";
import { AvatarStack } from "./AvatarStack";
import { ThemeToggle } from "./ThemeToggle";

function ConnectionDot() {
  const status = useStatus();
  const connected = status === "connected";
  return (
    <span
      title={connected ? "Connected" : "Reconnecting…"}
      className={`size-2 rounded-full ${connected ? "bg-emerald-500" : "animate-pulse bg-amber-500"}`}
    />
  );
}

// Fallback for insecure contexts (e.g. http://192.168.x.x) where the async
// Clipboard API is unavailable.
function legacyCopy(text: string): boolean {
  const textarea = document.createElement("textarea");
  textarea.value = text;
  textarea.setAttribute("readonly", "");
  textarea.style.position = "fixed";
  textarea.style.opacity = "0";
  document.body.appendChild(textarea);
  textarea.select();
  try {
    return document.execCommand("copy");
  } catch {
    return false;
  } finally {
    document.body.removeChild(textarea);
  }
}

function ClipboardIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="size-4" aria-hidden>
      <rect x="9" y="9" width="12" height="12" rx="2" />
      <path d="M5 15H4a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v1" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="size-4" aria-hidden>
      <path d="M20 6 9 17l-5-5" />
    </svg>
  );
}

export function RoomHeader({ code }: { code: string }) {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!copied) return;
    const timeout = setTimeout(() => setCopied(false), 2000);
    return () => clearTimeout(timeout);
  }, [copied]);

  async function copyInvite() {
    const link = `${window.location.origin}/room/${code}`;
    try {
      // navigator.clipboard only exists in secure contexts (HTTPS / localhost).
      await navigator.clipboard.writeText(link);
      setCopied(true);
    } catch {
      if (legacyCopy(link)) setCopied(true);
      else window.prompt("Copy this invite link:", link);
    }
  }

  return (
    <header className="flex items-center gap-2 border-b border-neutral-200 bg-white px-4 py-2 sm:gap-3 dark:border-neutral-800 dark:bg-neutral-900">
      <Link href="/" className="hidden font-semibold tracking-tight sm:block">
        FloJam
      </Link>
      <div className="flex items-center gap-2 rounded-lg bg-neutral-100 px-2.5 py-1 dark:bg-neutral-800">
        <ConnectionDot />
        <span className="font-mono text-sm">{code}</span>
      </div>
      <button
        type="button"
        onClick={copyInvite}
        title="Copy invite link to clipboard"
        className="flex cursor-pointer items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-sm font-medium text-sky-700 hover:bg-sky-50 dark:text-sky-400 dark:hover:bg-sky-950"
      >
        {copied ? <CheckIcon /> : <ClipboardIcon />}
        <span aria-live="polite">{copied ? "Copied!" : "Copy invite link"}</span>
      </button>

      <div className="ml-auto flex items-center gap-2 sm:gap-3">
        <AvatarStack />
        <ThemeToggle />
        <Link
          href="/"
          className="rounded-lg px-2.5 py-1.5 text-sm text-neutral-600 hover:bg-neutral-100 dark:text-neutral-300 dark:hover:bg-neutral-800"
        >
          Leave
        </Link>
      </div>
    </header>
  );
}

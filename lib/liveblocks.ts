import { Liveblocks, LiveblocksError } from "@liveblocks/node";

let client: Liveblocks | null = null;

/** Server-side Liveblocks client, or null when LIVEBLOCKS_SECRET_KEY is missing. */
export function getLiveblocks(): Liveblocks | null {
  const secret = process.env.LIVEBLOCKS_SECRET_KEY;
  if (!secret) return null;
  client ??= new Liveblocks({
    secret,
    baseUrl: process.env.NEXT_PUBLIC_LIVEBLOCKS_BASE_URL || undefined,
  });
  return client;
}

export async function roomExists(
  liveblocks: Liveblocks,
  roomId: string
): Promise<boolean> {
  try {
    await liveblocks.getRoom(roomId);
    return true;
  } catch (error) {
    if (error instanceof LiveblocksError && error.status === 404) return false;
    throw error;
  }
}

export const MISSING_KEY_MESSAGE =
  "Missing LIVEBLOCKS_SECRET_KEY. Copy .env.example to .env.local and add your secret key.";

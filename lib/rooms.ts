import { customAlphabet } from "nanoid";

/** All rooms created by this app live under this Liveblocks room id prefix. */
export const ROOM_PREFIX = "flowchart:";

// Lowercase letters + digits without look-alikes (0/o, 1/l/i).
const alphabet = "23456789abcdefghjkmnpqrstuvwxyz";
const nano = customAlphabet(alphabet, 6);

const CODE_PATTERN = new RegExp(`^[${alphabet}]{3}-[${alphabet}]{3}$`);

/** Generates a short, human-friendly room code like `k7x-92p`. */
export function generateCode(): string {
  const id = nano();
  return `${id.slice(0, 3)}-${id.slice(3)}`;
}

export function isValidCode(code: string): boolean {
  return CODE_PATTERN.test(code);
}

export function toRoomId(code: string): string {
  return `${ROOM_PREFIX}${code}`;
}

export function fromRoomId(roomId: string): string | null {
  if (!roomId.startsWith(ROOM_PREFIX)) return null;
  const code = roomId.slice(ROOM_PREFIX.length);
  return isValidCode(code) ? code : null;
}

/**
 * Accepts user input from the join form: a bare code (`K7X 92P`, `k7x92p`)
 * or a pasted invite link (`https://.../room/k7x-92p`).
 */
export function normalizeCode(input: string): string | null {
  let value = input.trim().toLowerCase();
  const fromUrl = value.match(/\/room\/([^/?#\s]+)/);
  if (fromUrl) value = fromUrl[1];
  value = value.replace(/[\s_-]+/g, "");
  if (value.length !== 6) return null;
  const code = `${value.slice(0, 3)}-${value.slice(3)}`;
  return isValidCode(code) ? code : null;
}

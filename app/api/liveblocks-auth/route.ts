import { NextRequest, NextResponse } from "next/server";
import { getLiveblocks, MISSING_KEY_MESSAGE, roomExists } from "@/lib/liveblocks";
import { MAX_NAME_LENGTH, USER_COLORS } from "@/lib/identity";
import { fromRoomId } from "@/lib/rooms";

/**
 * Authenticating your Liveblocks application
 * https://liveblocks.io/docs/api-reference/authentication
 *
 * Users are anonymous: the client sends its locally stored id, name and color,
 * and we grant access to the single room it asked for — only if that room was
 * created through /api/rooms.
 */

type AuthBody = {
  room?: unknown;
  user?: { id?: unknown; name?: unknown; color?: unknown };
};

function forbidden(reason: string, status = 403) {
  // Shape understood by the Liveblocks client; "forbidden" stops reconnect attempts.
  return NextResponse.json({ error: "forbidden", reason }, { status });
}

export async function POST(request: NextRequest) {
  const liveblocks = getLiveblocks();
  if (!liveblocks) return forbidden(MISSING_KEY_MESSAGE);

  let body: AuthBody;
  try {
    body = await request.json();
  } catch {
    return forbidden("Invalid request body", 400);
  }

  const room = typeof body.room === "string" ? body.room : "";
  if (!fromRoomId(room)) return forbidden("Invalid room");
  if (!(await roomExists(liveblocks, room))) return forbidden("Room not found");

  const { id, name, color } = body.user ?? {};
  if (typeof id !== "string" || !/^[\w-]{8,64}$/.test(id)) {
    return forbidden("Invalid user", 400);
  }
  const displayName =
    (typeof name === "string" ? name.trim().slice(0, MAX_NAME_LENGTH) : "") ||
    "Anonymous";
  const displayColor =
    typeof color === "string" && /^#[0-9a-f]{6}$/i.test(color)
      ? color
      : USER_COLORS[0];

  const session = liveblocks.prepareSession(id, {
    userInfo: { name: displayName, color: displayColor },
  });
  session.allow(room, session.FULL_ACCESS);

  const { status, body: token } = await session.authorize();
  return new NextResponse(token, {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

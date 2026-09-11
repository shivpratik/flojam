import { NextResponse } from "next/server";
import { getLiveblocks, MISSING_KEY_MESSAGE, roomExists } from "@/lib/liveblocks";
import { isValidCode, toRoomId } from "@/lib/rooms";

/** Checks whether a room exists, used by the join form. */
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ code: string }> }
) {
  const { code } = await params;
  if (!isValidCode(code)) {
    return NextResponse.json({ error: "Invalid room code" }, { status: 400 });
  }

  const liveblocks = getLiveblocks();
  if (!liveblocks) {
    return NextResponse.json({ error: MISSING_KEY_MESSAGE }, { status: 500 });
  }

  const exists = await roomExists(liveblocks, toRoomId(code));
  return exists
    ? NextResponse.json({ code })
    : NextResponse.json({ error: "Room not found" }, { status: 404 });
}

import { LiveblocksError } from "@liveblocks/node";
import { NextResponse } from "next/server";
import { getLiveblocks, MISSING_KEY_MESSAGE } from "@/lib/liveblocks";
import { generateCode, toRoomId } from "@/lib/rooms";

/** Creates a new room and returns its shareable code. */
export async function POST() {
  const liveblocks = getLiveblocks();
  if (!liveblocks) {
    return NextResponse.json({ error: MISSING_KEY_MESSAGE }, { status: 500 });
  }

  // Codes are random; retry on the (very unlikely) chance one is taken.
  for (let attempt = 0; attempt < 5; attempt++) {
    const code = generateCode();
    try {
      // No default access: users only get in via a token from /api/liveblocks-auth.
      await liveblocks.createRoom(toRoomId(code), { defaultAccesses: [] });
      return NextResponse.json({ code }, { status: 201 });
    } catch (error) {
      if (error instanceof LiveblocksError && error.status === 409) continue;
      console.error("Failed to create room", error);
      return NextResponse.json(
        { error: "Could not create room" },
        { status: 500 }
      );
    }
  }

  return NextResponse.json({ error: "Could not create room" }, { status: 500 });
}

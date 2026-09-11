import { NextRequest, NextResponse } from "next/server";
import { getLiveblocks, MISSING_KEY_MESSAGE } from "@/lib/liveblocks";
import { ROOM_PREFIX } from "@/lib/rooms";

/**
 * Deletes rooms nobody has connected to in ROOM_TTL_DAYS (default 7).
 * Rooms that were created but never opened count from their creation date.
 *
 * Called daily by Vercel Cron (see vercel.json), which sends
 * `Authorization: Bearer $CRON_SECRET`. Add `?dryRun=1` to list without deleting.
 */

const DAY_MS = 24 * 60 * 60 * 1000;
const DEFAULT_TTL_DAYS = 7;

export const maxDuration = 60;

export async function GET(request: NextRequest) {
  const secret = process.env.CRON_SECRET;
  if (!secret || request.headers.get("authorization") !== `Bearer ${secret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const liveblocks = getLiveblocks();
  if (!liveblocks) {
    return NextResponse.json({ error: MISSING_KEY_MESSAGE }, { status: 500 });
  }

  const ttlDays = Number(process.env.ROOM_TTL_DAYS) || DEFAULT_TTL_DAYS;
  const cutoff = Date.now() - ttlDays * DAY_MS;
  const dryRun = request.nextUrl.searchParams.get("dryRun") === "1";

  // Collect first, then delete, so deleting doesn't shift the pages we're reading.
  const stale: string[] = [];
  let scanned = 0;
  for await (const room of liveblocks.iterRooms({
    query: { roomId: { startsWith: ROOM_PREFIX } },
  })) {
    scanned++;
    const lastActive = room.lastConnectionAt ?? room.createdAt;
    if (new Date(lastActive).getTime() < cutoff) stale.push(room.id);
  }

  let deleted = 0;
  const failed: string[] = [];
  if (!dryRun) {
    for (const roomId of stale) {
      try {
        await liveblocks.deleteRoom(roomId);
        deleted++;
      } catch (error) {
        console.error(`Failed to delete ${roomId}`, error);
        failed.push(roomId);
      }
    }
  }

  const result = { ttlDays, scanned, stale: stale.length, deleted, failed, dryRun };
  console.log("Room cleanup", result);
  return NextResponse.json(result);
}

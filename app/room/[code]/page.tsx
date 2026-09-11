import Link from "next/link";
import { notFound } from "next/navigation";
import { getLiveblocks, MISSING_KEY_MESSAGE, roomExists } from "@/lib/liveblocks";
import { isValidCode, toRoomId } from "@/lib/rooms";
import { RoomClient } from "./RoomClient";

export default async function RoomPage({
  params,
}: {
  params: Promise<{ code: string }>;
}) {
  const { code } = await params;
  if (!isValidCode(code)) notFound();

  const liveblocks = getLiveblocks();
  if (!liveblocks) {
    return (
      <main className="flex min-h-dvh flex-col items-center justify-center gap-3 px-4 text-center">
        <h1 className="text-xl font-semibold">Liveblocks isn&apos;t configured</h1>
        <p className="max-w-md text-sm text-neutral-500">{MISSING_KEY_MESSAGE}</p>
        <Link href="/" className="text-sm text-sky-600 hover:underline">
          Back to home
        </Link>
      </main>
    );
  }

  if (!(await roomExists(liveblocks, toRoomId(code)))) notFound();

  return <RoomClient code={code} />;
}

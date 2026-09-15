"use client";

import {
  ClientSideSuspense,
  LiveblocksProvider,
  RoomProvider,
} from "@liveblocks/react/suspense";
import { useEffect, useState } from "react";
import { Flowchart } from "@/components/Flowchart";
import { Loading } from "@/components/Loading";
import { NameDialog } from "@/components/NameDialog";
import { RoomHeader } from "@/components/RoomHeader";
import { getIdentity, saveName, type Identity } from "@/lib/identity";
import { toRoomId } from "@/lib/rooms";

export function RoomClient({ code }: { code: string }) {
  // undefined = not read from localStorage yet, null = no name chosen.
  const [identity, setIdentity] = useState<Identity | null | undefined>();

  useEffect(() => {
    // localStorage is client-only, so it's read after hydration.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIdentity(getIdentity());
  }, []);

  if (identity === undefined) return <Loading />;

  // Visitors arriving via an invite link pick a name before connecting.
  if (identity === null) {
    return (
      <NameDialog code={code} onSubmit={(name) => setIdentity(saveName(name))} />
    );
  }

  return (
    <LiveblocksProvider
      throttle={16}
      baseUrl={process.env.NEXT_PUBLIC_LIVEBLOCKS_BASE_URL || undefined}
      authEndpoint={async (room) => {
        const response = await fetch("/api/liveblocks-auth", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ room, user: identity }),
        });
        return response.json();
      }}
    >
      <RoomProvider id={toRoomId(code)} initialPresence={{ cursor: null }}>
        <div className="flex h-dvh flex-col">
          <ClientSideSuspense fallback={<Loading label="Connecting to room…" />}>
            <RoomHeader code={code} />
            <main className="relative min-h-0 flex-1">
              <Flowchart />
            </main>
          </ClientSideSuspense>
        </div>
      </RoomProvider>
    </LiveblocksProvider>
  );
}

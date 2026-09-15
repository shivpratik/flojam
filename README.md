# FloJam — collaborative diagrams

[![CI](https://github.com/shivpratik/flojam/actions/workflows/ci.yml/badge.svg)](https://github.com/shivpratik/flojam/actions/workflows/ci.yml)

A real-time, multiplayer flowchart editor. Create a room, share the code or invite link,
and build diagrams together with live cursors, presence avatars and shared undo/redo.

Built with **Next.js 16**, **React Flow** (`@xyflow/react`), **Liveblocks** and **Tailwind CSS v4**.
Inspired by the [Liveblocks React Flow example](https://github.com/liveblocks/liveblocks/tree/main/examples/nextjs-react-flow).

<!-- ![Screenshot](./docs/screenshot.png) -->

## Features

- **Create & join rooms** — each room gets a short code like `k7x-92p`; join by code or invite link
- **No sign-up** — pick a display name; you get a persistent anonymous id and color
- **Real-time sync** — nodes, edges, labels, colors and sizes sync instantly via Liveblocks Storage
- **Live cursors & presence** — see who's online and where they're pointing
- **Editing tools** — add steps or emoji nodes, double-click to rename, recolor, resize, connect, delete
- **Undo / redo** — collaborative history
- **Dark mode** — follows your system, with a toggle that remembers your choice

## How rooms work

| Step | What happens |
| --- | --- |
| Create | `POST /api/rooms` generates a code and creates `flowchart:<code>` in Liveblocks with no default access |
| Join | `GET /api/rooms/<code>` checks the room exists, then navigates to `/room/<code>` |
| Connect | `POST /api/liveblocks-auth` issues a token for **only that room**, carrying your name and color |

Because rooms have no default access and the auth endpoint refuses unknown rooms,
typing a random URL can't create a room — only the "Create" button can.

### Room cleanup

Rooms and their diagrams persist after everyone leaves. To keep a public demo tidy, a daily
[Vercel Cron](https://vercel.com/docs/cron-jobs) job (`vercel.json`) calls
`/api/cron/cleanup-rooms`, which deletes rooms nobody has connected to in `ROOM_TTL_DAYS`
(default 7). The route requires `Authorization: Bearer $CRON_SECRET`; add `?dryRun=1` to see
what would be deleted:

```bash
curl -H "Authorization: Bearer $CRON_SECRET" "http://localhost:3000/api/cron/cleanup-rooms?dryRun=1"
```

## Getting started

```bash
npm install
cp .env.example .env.local
```

Then either:

- **Liveblocks cloud** — create a project at [liveblocks.io/dashboard](https://liveblocks.io/dashboard),
  copy the secret key into `LIVEBLOCKS_SECRET_KEY`, and run `npm run dev`.
- **Local dev server (no account)** — set `LIVEBLOCKS_SECRET_KEY=sk_localdev` and
  `NEXT_PUBLIC_LIVEBLOCKS_BASE_URL=http://localhost:1153`, then run `npm run dev:local`.

Open [http://localhost:3000](http://localhost:3000), create a room, and open the invite link in
another browser (or an incognito window) to collaborate with yourself.

## Deploying

Deploy to [Vercel](https://vercel.com/new), adding `LIVEBLOCKS_SECRET_KEY` and `CRON_SECRET`
as environment variables. The cleanup cron is picked up from `vercel.json` automatically.

## Project structure

```
app/
  page.tsx                  Landing page — name, create room, join room
  room/[code]/page.tsx      Validates the code and room existence (server)
  room/[code]/RoomClient.tsx  Name gate + Liveblocks providers (client)
  api/rooms/                Create room / check room exists
  api/liveblocks-auth/      Per-room access tokens
components/
  Flowchart.tsx             React Flow canvas synced with useLiveblocksFlow
  Toolbar.tsx               Add / delete nodes
  RoomHeader.tsx            Room code, invite link, avatars, theme toggle
  nodes/                    Editable and emoji node types
lib/
  rooms.ts                  Room code generation & validation
  identity.ts               Anonymous identity in localStorage
  liveblocks.ts             Server-side Liveblocks client
```

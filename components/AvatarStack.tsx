"use client";

import { shallow } from "@liveblocks/client";
import { useOthersMapped, useSelf } from "@liveblocks/react/suspense";

const MAX_SHOWN = 4;

function initials(name: string) {
  const parts = name.trim().split(/\s+/);
  return ((parts[0]?.[0] ?? "") + (parts[1]?.[0] ?? "")).toUpperCase() || "?";
}

function Avatar({
  name,
  color,
  isSelf = false,
}: {
  name: string;
  color: string;
  isSelf?: boolean;
}) {
  return (
    <div
      title={isSelf ? `${name} (you)` : name}
      className="-ml-2 flex size-8 items-center justify-center rounded-full text-xs font-semibold text-white ring-2 ring-white first:ml-0 dark:ring-neutral-900"
      style={{ backgroundColor: color }}
    >
      {initials(name)}
    </div>
  );
}

/** Everyone currently in the room; one avatar per user even with several tabs open. */
export function AvatarStack() {
  const self = useSelf((me) => ({ id: me.id, ...me.info }), shallow);
  const others = useOthersMapped(
    (other) => ({ id: other.id, ...other.info }),
    shallow
  );

  const unique = new Map<string, { name: string; color: string }>();
  for (const [, user] of others) {
    if (user.id !== self.id && !unique.has(user.id)) unique.set(user.id, user);
  }
  const users = [...unique.values()];
  const shown = users.slice(0, MAX_SHOWN);
  const hidden = users.length - shown.length;

  return (
    <div className="flex items-center" aria-label={`${users.length + 1} people in this room`}>
      <Avatar name={self.name} color={self.color} isSelf />
      {shown.map((user, i) => (
        <Avatar key={i} name={user.name} color={user.color} />
      ))}
      {hidden > 0 && (
        <div className="-ml-2 flex size-8 items-center justify-center rounded-full bg-neutral-200 text-xs font-medium ring-2 ring-white dark:bg-neutral-700 dark:ring-neutral-900">
          +{hidden}
        </div>
      )}
    </div>
  );
}

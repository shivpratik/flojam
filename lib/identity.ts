export type Identity = {
  id: string;
  name: string;
  color: string;
};

const STORAGE_KEY = "flowchart:identity";

export const USER_COLORS = [
  "#E57373",
  "#F06292",
  "#BA68C8",
  "#7986CB",
  "#4FC3F7",
  "#4DB6AC",
  "#81C784",
  "#FFB74D",
  "#A1887F",
];

export const MAX_NAME_LENGTH = 32;

function randomColor() {
  return USER_COLORS[Math.floor(Math.random() * USER_COLORS.length)];
}

function randomId() {
  return typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : Math.random().toString(36).slice(2) + Date.now().toString(36);
}

/** Returns the stored identity, or null if the user hasn't picked a name yet. */
export function getIdentity(): Identity | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<Identity>;
    if (!parsed.id || !parsed.name || !parsed.color) return null;
    return parsed as Identity;
  } catch {
    return null;
  }
}

/** Saves a display name, keeping the existing id/color when present. */
export function saveName(name: string): Identity {
  const existing = getIdentity();
  const identity: Identity = {
    id: existing?.id ?? randomId(),
    color: existing?.color ?? randomColor(),
    name: name.trim().slice(0, MAX_NAME_LENGTH),
  };
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(identity));
  } catch {
    // Storage unavailable (private mode etc.) — identity lives for this session only.
  }
  return identity;
}

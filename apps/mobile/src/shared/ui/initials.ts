// apps/mobile/src/shared/ui/initials.ts
/** "Ama Osei" -> "AO", "Kwame" -> "KW"? no -> "K". Falls back to "?". */
export function initials(name?: string | null): string {
  if (!name) return '?';
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return '?';
  const first = parts[0]![0] ?? '';
  const last = parts.length > 1 ? (parts[parts.length - 1]![0] ?? '') : '';
  return (first + last).toUpperCase() || '?';
}

/** Deterministic soft colour from a name, for the avatar background. */
const PALETTE = ['#1B365D', '#2E9E6F', '#5A287D', '#B45309', '#0369A1', '#DB0011'];
export function avatarColor(name?: string | null): string {
  if (!name) return PALETTE[0]!;
  let h = 0;
  for (let i = 0; i < name.length; i++) h = (h * 31 + name.charCodeAt(i)) >>> 0;
  return PALETTE[h % PALETTE.length]!;
}

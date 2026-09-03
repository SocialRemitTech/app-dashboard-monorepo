import { defaultFlags, type FlagKey } from '@sr/config';

let overrides: Partial<Record<FlagKey, boolean>> = {};
export function setFlagOverrides(next: Partial<Record<FlagKey, boolean>>) {
  overrides = next;
}
export function isEnabled(key: FlagKey): boolean {
  return overrides[key] ?? defaultFlags[key];
}

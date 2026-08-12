// apps/dashboard/src/features/corridors/corridors.store.ts
import { create } from 'zustand';
import { corridorRegistry, type CorridorDef } from '@sr/config';

interface CorridorsState {
  corridors: CorridorDef[];
  setLive: (code: string, live: boolean) => void;
}
/** Local editable copy. In production, setLive() PATCHes the config service the app reads. */
export const useCorridors = create<CorridorsState>((set) => ({
  corridors: corridorRegistry.map((c) => ({ ...c })),
  setLive: (code, live) =>
    set((s) => ({ corridors: s.corridors.map((c) => (c.code === code ? { ...c, live } : c)) })),
}));

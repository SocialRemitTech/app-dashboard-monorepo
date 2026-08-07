// apps/mobile/src/features/profile/stores/profile.store.ts
import { create } from 'zustand';

interface ProfileState {
  preferredName: string;
  greeting: string;
  phone: string;
  set: (p: Partial<ProfileState>) => void;
}

/** Lightweight profile facts used across the shell (greeting header, menu). */
export const useProfile = create<ProfileState>((set) => ({
  preferredName: '',
  greeting: '',
  phone: '+44 7700 900000',
  set: (p) => set(p),
}));

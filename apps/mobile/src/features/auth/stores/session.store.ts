import { create } from 'zustand';
import { secureStore } from '../../../shared/platform/secure-store';

/** Global client state: is there a session? The token itself lives in secure storage, not here. */
interface SessionState {
  status: 'loading' | 'authenticated' | 'unauthenticated';
  userId: string | null;
  bootstrap: () => Promise<void>;
  signIn: (tokens: { accessToken: string; refreshToken: string; userId: string }) => Promise<void>;
  signOut: () => Promise<void>;
}

export const useSession = create<SessionState>((set) => ({
  status: 'loading',
  userId: null,
  async bootstrap() {
    const token = await secureStore.get('accessToken');
    set({ status: token ? 'authenticated' : 'unauthenticated' });
  },
  async signIn(tokens) {
    await secureStore.set('accessToken', tokens.accessToken);
    await secureStore.set('refreshToken', tokens.refreshToken);
    set({ status: 'authenticated', userId: tokens.userId });
  },
  async signOut() {
    await secureStore.delete('accessToken');
    await secureStore.delete('refreshToken');
    set({ status: 'unauthenticated', userId: null });
  },
}));

import * as SecureStore from 'expo-secure-store';

/** Typed keys — the only place secrets are named. Tokens live in Keychain/Keystore, never AsyncStorage. */
const KEYS = {
  accessToken: 'sr.accessToken',
  refreshToken: 'sr.refreshToken',
} as const;
type Key = keyof typeof KEYS;

export const secureStore = {
  async get(key: Key): Promise<string | null> {
    return SecureStore.getItemAsync(KEYS[key]);
  },
  async set(key: Key, value: string): Promise<void> {
    await SecureStore.setItemAsync(KEYS[key], value, {
      keychainAccessible: SecureStore.WHEN_UNLOCKED_THIS_DEVICE_ONLY,
    });
  },
  async delete(key: Key): Promise<void> {
    await SecureStore.deleteItemAsync(KEYS[key]);
  },
};

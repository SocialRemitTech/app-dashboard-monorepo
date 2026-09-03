// apps/mobile/src/shared/platform/storage.ts
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createJSONStorage } from 'zustand/middleware';

/** JSON storage backed by AsyncStorage — used by persisted zustand stores. */
export const persistStorage = createJSONStorage(() => AsyncStorage);

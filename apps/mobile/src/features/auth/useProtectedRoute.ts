// apps/mobile/src/features/auth/useProtectedRoute.ts
import { useEffect } from 'react';
import { useSegments, useRouter } from 'expo-router';
import { entryHref } from './entry';

type Status = 'loading' | 'authenticated' | 'unauthenticated';

/**
 * The ONLY place that routes based on auth. Replaces the competing <Redirect> components
 * that were fighting each other (the update loop). It only navigates when the user is in
 * the wrong group, and after navigating the segments change so the condition goes false —
 * so it can't loop.
 */
export function useProtectedRoute(status: Status) {
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (status === 'loading') return;
    const first = segments[0]; // '(auth)' | '(app)' | 'intro' | undefined(root)
    const inPublic = first === '(auth)' || first === 'intro';

    if (status === 'unauthenticated' && !inPublic) {
      router.replace(entryHref as never);
    } else if (status === 'authenticated' && (inPublic || first === undefined)) {
      router.replace('/(app)/(tabs)');
    }
  }, [status, segments, router]);
}

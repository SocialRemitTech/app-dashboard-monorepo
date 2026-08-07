// apps/mobile/app/(app)/_layout.tsx — auth guard for the authenticated app
import { Redirect, Stack } from 'expo-router';
import { useSession } from '@/features/auth';

export default function AppLayout() {
  const status = useSession((s) => s.status);
  if (status === 'loading') return null;
  if (status === 'unauthenticated') return <Redirect href="/(auth)/welcome" />;
  return <Stack screenOptions={{ headerShown: false }} />;
}

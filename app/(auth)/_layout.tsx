// apps/mobile/app/(auth)/_layout.tsx — guard: authed users skip the auth stack
import { Redirect, Stack } from 'expo-router';
import { useSession } from '@/features/auth';

export default function AuthLayout() {
  const status = useSession((s) => s.status);
  if (status === 'authenticated') return <Redirect href="/(app)/(tabs)" />;
  return <Stack screenOptions={{ headerShown: false }} initialRouteName="get-acquainted" />;
}

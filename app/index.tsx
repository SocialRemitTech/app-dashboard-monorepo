// apps/mobile/app/index.tsx — entry gate
import { Redirect } from 'expo-router';
import { useSession } from '@/features/auth';

export default function Index() {
  const status = useSession((s) => s.status);
  if (status === 'loading') return null;
  return <Redirect href={status === 'authenticated' ? '/(app)/(tabs)' : '/intro'} />;
}

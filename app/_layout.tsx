// apps/mobile/app/_layout.tsx — root: fonts + providers + api config + session bootstrap
import { useEffect } from 'react';
import { Stack } from 'expo-router';
import Constants from 'expo-constants';
import * as SplashScreen from 'expo-splash-screen';
import { useFonts } from 'expo-font';
import {
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
} from '@expo-google-fonts/inter';
import { Sora_600SemiBold, Sora_700Bold } from '@expo-google-fonts/sora';
import '@/../global.css';
import { AppProviders } from '@/providers/AppProviders';
import { configureApi } from '@/data/api-client';
import { useSession } from '@/features/auth';

const extra = Constants.expoConfig?.extra as
  { apiBaseUrl?: string; environment?: string } | undefined;
configureApi(extra?.apiBaseUrl ?? 'http://localhost:4000', extra?.environment === 'development');
void SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const bootstrap = useSession((s) => s.bootstrap);
  const [fontsLoaded] = useFonts({
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
    Sora_600SemiBold,
    Sora_700Bold,
  });

  useEffect(() => {
    void bootstrap();
  }, [bootstrap]);
  useEffect(() => {
    if (fontsLoaded) void SplashScreen.hideAsync();
  }, [fontsLoaded]);

  if (!fontsLoaded) return null;
  return (
    <AppProviders>
      <Stack screenOptions={{ headerShown: false }} />
    </AppProviders>
  );
}

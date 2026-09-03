// apps/mobile/src/features/wallet/screens/WalletProcessingScreen.tsx
import { useEffect, useRef } from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import { router } from 'expo-router';
import { Screen } from '@/shared/ui/Screen';
import { useWallet } from '@/features/wallet/stores/wallet.store';
import { color } from '@sr/design-tokens';

export function WalletProcessingScreen() {
  const commitTopup = useWallet((s) => s.commitTopup);
  const done = useRef(false);

  useEffect(() => {
    const t = setTimeout(() => {
      if (done.current) return;
      done.current = true;
      commitTopup();
      router.replace('/(app)/wallet/success');
    }, 2200);
    return () => clearTimeout(t);
  }, [commitTopup]);

  return (
    <Screen>
      <View className="flex-1 items-center justify-center gap-6">
        <ActivityIndicator size="large" color={color.coral.DEFAULT} />
        <View className="items-center gap-1">
          <Text className="font-display-bold text-navy-deep" style={{ fontSize: 26 }}>
            Processing payment…
          </Text>
          <Text className="font-sans text-body text-navy/55">
            This usually takes a few seconds.
          </Text>
        </View>
      </View>
    </Screen>
  );
}

// apps/mobile/src/features/open-banking/screens/OpenBankingProcessingScreen.tsx
import { useEffect, useRef } from 'react';
import { View, Text, Animated, Easing } from 'react-native';
import { router } from 'expo-router';
import { Screen } from '@/shared/ui/Screen';
import { useOpenBanking } from '@/features/open-banking/stores/openbanking.store';
import { useWallet, gbp } from '@/features/wallet/stores/wallet.store';

export function OpenBankingProcessingScreen() {
  const { context, amountMinor } = useOpenBanking();
  const commitTopup = useWallet((s) => s.commitTopup);
  const spin = useRef(new Animated.Value(0)).current;
  const done = useRef(false);

  // Rotating ring
  useEffect(() => {
    const loop = Animated.loop(
      Animated.timing(spin, {
        toValue: 1,
        duration: 900,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
    );
    loop.start();
    return () => loop.stop();
  }, [spin]);

  // Finish by context
  useEffect(() => {
    const t = setTimeout(() => {
      if (done.current) return;
      done.current = true;
      if (context === 'topup') {
        commitTopup();
        router.replace('/(app)/wallet/success');
      } else {
        router.replace('/(app)/send/processing');
      }
    }, 2600);
    return () => clearTimeout(t);
  }, [context, commitTopup]);

  const rotate = spin.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '360deg'] });

  return (
    <Screen>
      <View className="flex-1 items-center justify-center gap-6">
        <View style={{ width: 96, height: 96, alignItems: 'center', justifyContent: 'center' }}>
          <Animated.View
            style={{
              position: 'absolute',
              width: 96,
              height: 96,
              borderRadius: 48,
              borderWidth: 4,
              borderColor: '#F0EBE3',
              borderTopColor: '#FF5A2A',
              transform: [{ rotate }],
            }}
          />
          <Text className="font-sans-bold text-navy-deep" style={{ fontSize: 16 }}>
            {gbp(amountMinor)}
          </Text>
        </View>
        <View className="items-center gap-1">
          <Text className="font-display-bold text-navy-deep" style={{ fontSize: 24 }}>
            {context === 'topup' ? 'Adding money to your wallet' : 'Sending your money'}
          </Text>
          <Text className="font-sans text-body text-navy/55">
            Please wait while we process your payment.
          </Text>
        </View>
      </View>
    </Screen>
  );
}

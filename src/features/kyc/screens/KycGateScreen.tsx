// apps/mobile/src/features/kyc/screens/KycGateScreen.tsx
import { useState } from 'react';
import { View, Text } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Screen } from '@/shared/ui/Screen';
import { BackButton } from '@/shared/ui/BackButton';
import { Button } from '@/shared/ui/Button';
import { TipCard } from '@/shared/ui/TipCard';
import { useKyc } from '@/features/kyc/stores/kyc.store';
import { color } from '@sr/design-tokens';

export function KycGateScreen() {
  const setStatus = useKyc((s) => s.setStatus);
  const [verifying, setVerifying] = useState(false);

  const verify = () => {
    setVerifying(true);
    // Production: launch the Sumsub SDK; the backend verifies the result. Here we simulate success.
    setTimeout(() => {
      setStatus('verified');
      router.replace('/(app)/send/payment');
    }, 1500);
  };

  return (
    <Screen>
      <View className="pt-2">
        <BackButton fallback="/(app)/send/recipient" />
      </View>
      <View className="flex-1 items-center justify-center gap-5">
        <View
          className="h-20 w-20 rounded-card items-center justify-center"
          style={{ backgroundColor: color.coral.DEFAULT }}
        >
          <Ionicons name="shield-checkmark" size={40} color={color.white} />
        </View>
        <View className="items-center gap-2">
          <Text className="font-display-bold text-navy-deep text-center" style={{ fontSize: 26 }}>
            Let’s verify it’s you
          </Text>
          <Text className="font-sans text-body text-navy/55 text-center px-4">
            A quick ID check keeps your money safe and meets UK regulations. Takes about a minute.
          </Text>
        </View>
      </View>
      <View className="pb-4 gap-3">
        <Button
          label={verifying ? 'Verifying…' : 'Verify identity'}
          onPress={verify}
          disabled={verifying}
        />
        <TipCard>You’ll only need to do this once. We use bank-grade verification.</TipCard>
      </View>
    </Screen>
  );
}

// apps/mobile/src/features/send-money/screens/RecipientVerifyScreen.tsx
import { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Screen } from '@/shared/ui/Screen';
import { BackButton } from '@/shared/ui/BackButton';
import { Button } from '@/shared/ui/Button';
import { useSend } from '@/features/send-money/stores/send.store';
import { color } from '@sr/design-tokens';

export function RecipientVerifyScreen() {
  const { recipientName, recipientBank, recipientAccount } = useSend();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const id = setTimeout(() => setChecking(false), 1800);
    return () => clearTimeout(id);
  }, []);

  const masked = `••••${recipientAccount.slice(-4)}`;

  if (checking) {
    return (
      <Screen>
        <View className="flex-1 items-center justify-center gap-5">
          <ActivityIndicator size="large" color={color.coral.DEFAULT} />
          <Text className="font-display-bold text-navy-deep" style={{ fontSize: 22 }}>
            Verifying bank account…
          </Text>
        </View>
      </Screen>
    );
  }

  return (
    <Screen>
      <View className="pt-2">
        <BackButton fallback="/(app)/send/recipient" />
      </View>
      <View className="items-center mt-6 gap-2">
        <View
          className="h-16 w-16 rounded-pill items-center justify-center"
          style={{ backgroundColor: '#DCFCE7' }}
        >
          <Ionicons name="checkmark" size={34} color={color.success.DEFAULT} />
        </View>
        <Text className="font-display-bold text-navy-deep" style={{ fontSize: 24 }}>
          Bank account verified
        </Text>
        <Text className="font-sans text-body text-navy/55 text-center">
          Please confirm the recipient details below.
        </Text>
      </View>

      <View className="rounded-card bg-white border border-border/60 mt-8 px-5 py-2">
        <Row label="Bank" value={recipientBank} />
        <Row label="Account number" value={masked} />
        <Row label="Account holder" value={recipientName} last />
      </View>
      <View className="rounded-card bg-success/10 mt-4 px-4 py-3 flex-row items-center gap-2">
        <Ionicons name="shield-checkmark" size={18} color={color.success.DEFAULT} />
        <Text className="font-sans-medium text-caption text-navy/70">
          Bank account verified successfully.
        </Text>
      </View>

      <View className="flex-1" />
      <View className="pb-4">
        <Button label="Continue" onPress={() => router.push('/(app)/send/kyc-gate')} />
      </View>
    </Screen>
  );
}

function Row({ label, value, last }: { label: string; value: string; last?: boolean }) {
  return (
    <View
      className={`flex-row justify-between py-3 ${last ? '' : 'border-b border-border-divider'}`}
    >
      <Text className="font-sans text-body text-navy/55">{label}</Text>
      <Text className="font-sans-semibold text-body text-navy-deep">{value}</Text>
    </View>
  );
}

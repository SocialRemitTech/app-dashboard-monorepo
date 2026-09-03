// apps/mobile/src/features/wallet/screens/TopUpScreen.tsx
import { View, Text, Pressable, TextInput } from 'react-native';
import { router } from 'expo-router';
import { Screen } from '@/shared/ui/Screen';
import { PageHeader } from '@/shared/ui/PageHeader';
import { Button } from '@/shared/ui/Button';
import { useWallet, gbp } from '@/features/wallet/stores/wallet.store';
import { color } from '@sr/design-tokens';

const QUICK = [5000, 10000, 25000, 50000]; // +£50 / +£100 / +£250 / +£500

export function TopUpScreen() {
  const { balanceMinor, topupAmountMinor, setTopupAmount } = useWallet();
  const major = topupAmountMinor / 100;

  return (
    <Screen>
      <PageHeader title="Top Up Wallet" subtitle="Add money to your Social Remit wallet" />

      {/* Current balance */}
      <View className="rounded-card bg-white border border-border/60 px-5 py-4 mt-6">
        <Text className="font-sans text-caption text-navy/50">Current Wallet Balance</Text>
        <Text className="font-display-bold text-navy-deep mt-1" style={{ fontSize: 30 }}>
          {gbp(balanceMinor)}
        </Text>
      </View>

      {/* Amount */}
      <Text className="font-sans-bold text-base text-navy-deep mt-7 mb-2">
        How much would you like to add?
      </Text>
      <View className="h-16 rounded-card bg-white border border-border px-5 flex-row items-center">
        <Text className="font-display-bold text-navy/30" style={{ fontSize: 26 }}>
          £
        </Text>
        <TextInput
          value={major ? String(major) : ''}
          onChangeText={(t) => setTopupAmount(Number(t.replace(/[^\d]/g, '') || 0) * 100)}
          placeholder="0.00"
          placeholderTextColor={color.grey.light}
          keyboardType="number-pad"
          className="flex-1 ml-2 font-display-bold text-navy"
          style={{ fontSize: 26 }}
        />
      </View>

      <View className="flex-row gap-3 mt-4">
        {QUICK.map((m) => (
          <Pressable
            key={m}
            onPress={() => setTopupAmount(topupAmountMinor + m)}
            className="flex-1 h-11 rounded-input items-center justify-center bg-coral/10"
          >
            <Text className="font-sans-semibold text-body text-coral">+£{m / 100}</Text>
          </Pressable>
        ))}
      </View>

      <View className="flex-1" />
      <View className="pb-6">
        <Button
          label="Continue"
          onPress={() => router.push('/(app)/wallet/method')}
          disabled={topupAmountMinor <= 0}
        />
      </View>
    </Screen>
  );
}

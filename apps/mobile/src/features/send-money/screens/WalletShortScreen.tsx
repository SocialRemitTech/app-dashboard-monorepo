// apps/mobile/src/features/send-money/screens/WalletShortScreen.tsx
import { View, Text, Pressable } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Screen } from '@/shared/ui/Screen';
import { BackButton } from '@/shared/ui/BackButton';
import { Button } from '@/shared/ui/Button';
import { useSend } from '@/features/send-money/stores/send.store';
import { useWallet, gbp } from '@/features/wallet/stores/wallet.store';
import { color } from '@sr/design-tokens';

export function WalletShortScreen() {
  const sendAmountMinor = useSend((s) => s.sendAmountMinor);
  const balanceMinor = useWallet((s) => s.balanceMinor);
  const needed = Math.max(0, sendAmountMinor - balanceMinor);

  return (
    <Screen>
      <View className="pt-2">
        <BackButton fallback="/(app)/send/payment" />
      </View>

      <View className="items-center mt-6 gap-2">
        <View className="h-16 w-16 rounded-pill bg-warning/15 items-center justify-center">
          <Ionicons name="wallet-outline" size={30} color={color.processing} />
        </View>
        <Text className="font-display-bold text-navy-deep" style={{ fontSize: 24 }}>
          Not enough in your wallet
        </Text>
        <Text className="font-sans text-body text-navy/55 text-center">
          Top up your wallet or choose a different payment method.
        </Text>
      </View>

      <View className="rounded-card bg-white border border-border/60 mt-8 px-5 py-2">
        <Row label="Transfer amount" value={gbp(sendAmountMinor)} />
        <Row label="Wallet balance" value={gbp(balanceMinor)} />
        <Row label="Amount needed" value={gbp(needed)} accent last />
      </View>

      <View className="flex-1" />
      <View className="pb-6 gap-3">
        <Button
          label={`Top up ${gbp(needed)}`}
          onPress={() => router.push('/(app)/wallet/top-up')}
        />
        <Button label="Choose another method" variant="outline" onPress={() => router.back()} />
      </View>
    </Screen>
  );
}

function Row({
  label,
  value,
  accent,
  last,
}: {
  label: string;
  value: string;
  accent?: boolean;
  last?: boolean;
}) {
  return (
    <View
      className={`flex-row justify-between py-3 ${last ? '' : 'border-b border-border-divider'}`}
    >
      <Text className="font-sans text-body text-navy/55">{label}</Text>
      <Text
        className="font-sans-bold text-body"
        style={{ color: accent ? color.coral.DEFAULT : color.navy.deep }}
      >
        {value}
      </Text>
    </View>
  );
}

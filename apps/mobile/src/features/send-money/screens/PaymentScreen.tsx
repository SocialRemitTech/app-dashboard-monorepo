// apps/mobile/src/features/send-money/screens/PaymentScreen.tsx
import { View, Text, Pressable } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Screen } from '@/shared/ui/Screen';
import { BackButton } from '@/shared/ui/BackButton';
import { useSend, type PaymentMethod } from '@/features/send-money/stores/send.store';
import { useWallet, gbp } from '@/features/wallet/stores/wallet.store';
import { color } from '@sr/design-tokens';

export function PaymentScreen() {
  const { sendAmountMinor, set } = useSend();
  const balanceMinor = useWallet((s) => s.balanceMinor);
  const walletShort = balanceMinor < sendAmountMinor;

  const choose = (id: PaymentMethod) => {
    // Paying from wallet with too little balance → route to the top-up prompt instead.
    if (id === 'wallet' && walletShort) {
      router.push('/(app)/send/wallet-short');
      return;
    }
    set({ paymentMethod: id });
    router.push('/(app)/send/summary');
  };

  const OPTIONS = [
    {
      id: 'debit_card' as const,
      icon: 'card-outline' as const,
      title: 'Debit card',
      sub: 'Instant · Visa or Mastercard',
    },
    {
      id: 'pay_by_bank' as const,
      icon: 'business-outline' as const,
      title: 'Pay by bank',
      sub: 'Instant · Secure bank payment',
    },
    {
      id: 'wallet' as const,
      icon: 'wallet-outline' as const,
      title: 'Social Remit Wallet',
      sub: `Balance ${gbp(balanceMinor)} · Top up to pay from your wallet`,
    },
  ];

  return (
    <Screen>
      <View className="pt-2 flex-row items-center justify-between">
        <BackButton fallback="/(app)/send/recipient" />
        <Pressable onPress={() => router.replace('/(app)/(tabs)')}>
          <Ionicons name="close" size={24} color={color.grey.mid} />
        </Pressable>
      </View>

      <Text className="font-display-bold text-navy-deep mt-3" style={{ fontSize: 30 }}>
        How would you like to pay?
      </Text>

      <View className="gap-3 mt-6">
        {OPTIONS.map((o) => (
          <Pressable
            key={o.id}
            onPress={() => choose(o.id)}
            className="rounded-card bg-white border border-border/60 p-4 flex-row items-center"
          >
            <View className="h-11 w-11 rounded-input bg-white border border-border/60 items-center justify-center mr-3">
              <Ionicons name={o.icon} size={22} color={color.navy.DEFAULT} />
            </View>
            <View className="flex-1">
              <Text className="font-sans-bold text-base text-navy-deep">{o.title}</Text>
              <Text className="font-sans text-caption text-navy/50 mt-0.5">{o.sub}</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color={color.grey.light} />
          </Pressable>
        ))}
      </View>

      <View className="flex-row items-center justify-center gap-2 mt-6">
        <Ionicons name="lock-closed" size={14} color={color.grey.light} />
        <Text className="font-sans text-caption text-navy/45">
          Your payment is protected with bank-level security.
        </Text>
      </View>
    </Screen>
  );
}

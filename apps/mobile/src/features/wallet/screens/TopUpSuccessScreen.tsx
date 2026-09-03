// apps/mobile/src/features/wallet/screens/TopUpSuccessScreen.tsx
import { useEffect, useRef } from 'react';
import { View, Text } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Screen } from '@/shared/ui/Screen';
import { Button } from '@/shared/ui/Button';
import { useWallet, gbp } from '@/features/wallet/stores/wallet.store';
import { useTransactions } from '@/features/activity/stores/transactions.store';
import { color } from '@sr/design-tokens';

export function TopUpSuccessScreen() {
  const { balanceMinor, topupAmountMinor, method } = useWallet();
  const add = useTransactions((s) => s.add);
  const recorded = useRef(false);

  // Record the top-up exactly once when this screen mounts.
  useEffect(() => {
    if (recorded.current || topupAmountMinor <= 0) return;
    recorded.current = true;
    add({
      type: 'topup',
      status: 'completed',
      amountMinor: topupAmountMinor,
      method: method === 'open_banking' ? 'Open Banking' : 'Debit Card',
    });
  }, [add, topupAmountMinor, method]);

  return (
    <Screen>
      <View className="flex-1 items-center justify-center gap-3">
        <View
          className="h-20 w-20 rounded-pill items-center justify-center"
          style={{ backgroundColor: '#DCFCE7' }}
        >
          <Ionicons name="checkmark" size={44} color={color.success.DEFAULT} />
        </View>
        <Text
          className="font-display-bold text-navy-deep text-center"
          style={{ fontSize: 28, lineHeight: 34 }}
        >
          Money added{'\n'}successfully
        </Text>
        <Text className="font-sans text-body text-navy/55">Your wallet has been topped up</Text>

        <View className="w-full mt-6 gap-4">
          <View className="items-center">
            <Text className="font-sans text-caption text-navy/50">Amount Added</Text>
            <Text
              className="font-display-bold mt-1"
              style={{ fontSize: 26, color: color.success.wallet }}
            >
              +{gbp(topupAmountMinor)}
            </Text>
          </View>
          <View className="items-center">
            <Text className="font-sans text-caption text-navy/50">New Wallet Balance</Text>
            <Text className="font-display-bold text-navy-deep mt-1" style={{ fontSize: 26 }}>
              {gbp(balanceMinor)}
            </Text>
          </View>
        </View>
      </View>

      <View className="pb-6 gap-3">
        <Button label="Send Money" onPress={() => router.replace('/(app)/send/destination')} />
        <Button
          label="Back to Wallet"
          variant="outline"
          onPress={() => router.replace('/(app)/(tabs)')}
        />
      </View>
    </Screen>
  );
}

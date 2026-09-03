// apps/mobile/src/features/wallet/screens/AddMoneyMethodScreen.tsx
import { View, Text, Pressable } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Screen } from '@/shared/ui/Screen';
import { PageHeader } from '@/shared/ui/PageHeader';
import { Button } from '@/shared/ui/Button';
import { useWallet, gbp } from '@/features/wallet/stores/wallet.store';
import { useOpenBanking } from '@/features/open-banking/stores/openbanking.store';
import { color } from '@sr/design-tokens';

const OPTIONS = [
  {
    id: 'open_banking',
    icon: 'business-outline',
    title: 'Open Banking',
    tag: 'Recommended',
    sub: 'Instant bank transfer',
  },
  { id: 'debit_card', icon: 'card-outline', title: 'Debit Card', sub: 'Visa or Mastercard' },
] as const;

export function AddMoneyMethodScreen() {
  const { topupAmountMinor, method, setMethod } = useWallet();
  const begin = useOpenBanking((s) => s.begin);

  const onContinue = () => {
    if (method === 'open_banking') {
      begin('topup', topupAmountMinor);
      router.push('/(app)/open-banking/choose');
    } else {
      router.push('/(app)/wallet/processing'); // debit card mock
    }
  };

  return (
    <Screen>
      <PageHeader
        title="Choose how to add money"
        subtitle={`Adding ${gbp(topupAmountMinor)} to your wallet`}
      />
      <View className="gap-3 mt-6">
        {OPTIONS.map((o) => {
          const on = method === o.id;
          return (
            <Pressable
              key={o.id}
              onPress={() => setMethod(o.id)}
              className={`rounded-card px-4 py-4 flex-row items-center ${on ? 'bg-coral/10 border border-coral/40' : 'bg-white border border-border/60'}`}
            >
              <View
                className="h-6 w-6 rounded-pill border-2 items-center justify-center mr-3"
                style={{ borderColor: on ? color.coral.DEFAULT : color.border.DEFAULT }}
              >
                {on ? (
                  <View
                    className="h-3 w-3 rounded-pill"
                    style={{ backgroundColor: color.coral.DEFAULT }}
                  />
                ) : null}
              </View>
              <View className="h-11 w-11 rounded-input bg-white border border-border/60 items-center justify-center mr-3">
                <Ionicons name={o.icon} size={22} color={color.navy.DEFAULT} />
              </View>
              <View className="flex-1">
                <Text className="font-sans-bold text-base text-navy-deep">{o.title}</Text>
                {'tag' in o ? (
                  <Text className="font-sans-semibold text-caption text-coral">{o.tag}</Text>
                ) : null}
                <Text className="font-sans text-caption text-navy/50">{o.sub}</Text>
              </View>
              <Ionicons name="chevron-forward" size={18} color={color.grey.light} />
            </Pressable>
          );
        })}
      </View>
      <View className="flex-1" />
      <View className="pb-6">
        <Button label="Continue" onPress={onContinue} />
      </View>
    </Screen>
  );
}

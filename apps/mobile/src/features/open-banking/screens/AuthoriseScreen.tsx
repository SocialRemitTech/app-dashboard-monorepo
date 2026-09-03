// apps/mobile/src/features/open-banking/screens/AuthoriseScreen.tsx
import { View, Text, Pressable } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Screen } from '@/shared/ui/Screen';
import { BackButton } from '@/shared/ui/BackButton';
import { Button } from '@/shared/ui/Button';
import { useOpenBanking } from '@/features/open-banking/stores/openbanking.store';
import { gbp } from '@/features/open-banking/data/banks';
import { color } from '@sr/design-tokens';

export function AuthoriseScreen() {
  const { bankName, bankColor, bankInitials, amountMinor, context } = useOpenBanking();
  const steps = [
    "You'll be redirected to your bank to authenticate",
    'Authorise the payment using your bank app or credentials',
    context === 'topup'
      ? 'Funds will appear in your wallet instantly'
      : 'Your payment will be sent instantly',
  ];

  return (
    <Screen>
      <View className="pt-2">
        <BackButton fallback="/(app)/open-banking/choose" />
      </View>

      <View className="items-center mt-4 gap-2">
        <View
          className="h-20 w-20 rounded-card items-center justify-center"
          style={{ backgroundColor: bankColor || color.navy.deep }}
        >
          <Text className="font-sans-bold text-white" style={{ fontSize: 22 }}>
            {bankInitials}
          </Text>
        </View>
        <Text className="font-sans text-body text-navy/55">{bankName}</Text>
        <Text className="font-sans text-body text-navy/55 mt-2">You are authorising</Text>
        <Text className="font-display-bold text-navy-deep" style={{ fontSize: 44 }}>
          {gbp(amountMinor)}
        </Text>
      </View>

      <View className="rounded-card bg-white border border-border/60 mt-8 px-5 py-4 gap-4">
        {steps.map((t, i) => (
          <View key={i} className="flex-row gap-3">
            <View className="h-6 w-6 rounded-pill bg-coral/10 items-center justify-center">
              <Text className="font-sans-bold text-caption text-coral">{i + 1}</Text>
            </View>
            <Text className="flex-1 font-sans text-body text-navy-deep">{t}</Text>
          </View>
        ))}
      </View>

      <View className="flex-row items-center justify-center gap-2 mt-5">
        <Ionicons name="lock-closed" size={14} color={color.grey.light} />
        <Text className="font-sans text-caption text-navy/45">
          Protected by bank-level Open Banking security
        </Text>
      </View>

      <View className="flex-1" />
      <View className="pb-6 gap-3">
        <Button
          label={`Continue to ${bankName}`}
          onPress={() => router.push('/(app)/open-banking/processing')}
        />
        <Pressable onPress={() => router.back()} className="items-center">
          <Text className="font-sans-semibold text-body text-navy/70">Choose a different bank</Text>
        </Pressable>
      </View>
    </Screen>
  );
}

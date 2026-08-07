// apps/mobile/src/features/send-money/screens/PaymentScreen.tsx
import { View, Text, Pressable } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Screen } from '@/shared/ui/Screen';
import { BackButton } from '@/shared/ui/BackButton';
import { Button } from '@/shared/ui/Button';
import { useSend, type PaymentMethod } from '@/features/send-money/stores/send.store';
import { color } from '@sr/design-tokens';

const METHODS: {
  id: PaymentMethod;
  label: string;
  sub: string;
  icon: keyof typeof Ionicons.glyphMap;
}[] = [
  {
    id: 'open_banking',
    label: 'Bank transfer',
    sub: 'Instant · via your bank',
    icon: 'business-outline',
  },
  { id: 'card', label: 'Debit card', sub: 'Visa, Mastercard', icon: 'card-outline' },
  { id: 'apple_pay', label: 'Apple Pay', sub: 'One tap', icon: 'logo-apple' },
];

export function PaymentScreen() {
  const { paymentMethod, set } = useSend();
  return (
    <Screen>
      <View className="pt-2">
        <BackButton fallback="/(app)/send/recipient" />
      </View>
      <Text className="font-display-bold text-navy-deep mt-3" style={{ fontSize: 30 }}>
        How are you paying?
      </Text>
      <Text className="font-sans text-body text-navy/55 mt-1">Choose a payment method.</Text>

      <View className="mt-6 gap-3">
        {METHODS.map((m) => {
          const on = paymentMethod === m.id;
          return (
            <Pressable
              key={m.id}
              onPress={() => set({ paymentMethod: m.id })}
              className={`rounded-card p-4 flex-row items-center ${on ? 'bg-coral/10 border border-coral/40' : 'bg-white border border-border/60'}`}
            >
              <View className="h-10 w-10 rounded-pill bg-coral/10 items-center justify-center mr-3">
                <Ionicons name={m.icon} size={20} color={color.coral.DEFAULT} />
              </View>
              <View className="flex-1">
                <Text className="font-sans-bold text-base text-navy-deep">{m.label}</Text>
                <Text className="font-sans text-caption text-navy/50">{m.sub}</Text>
              </View>
              {on ? (
                <Ionicons name="checkmark-circle" size={22} color={color.coral.DEFAULT} />
              ) : null}
            </Pressable>
          );
        })}
      </View>

      <View className="flex-1" />
      <View className="pb-4">
        <Button
          label="Continue"
          onPress={() => router.push('/(app)/send/summary')}
          disabled={!paymentMethod}
        />
      </View>
    </Screen>
  );
}

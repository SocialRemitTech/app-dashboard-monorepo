// apps/mobile/src/features/send-money/screens/DeliveryMethodScreen.tsx
import { View, Text, Pressable } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Screen } from '@/shared/ui/Screen';
import { BackButton } from '@/shared/ui/BackButton';
import { useSend, type DeliveryType } from '@/features/send-money/stores/send.store';
import { color } from '@sr/design-tokens';

const METHODS: {
  id: DeliveryType;
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  sub: string;
}[] = [
  {
    id: 'mobile_wallet',
    icon: 'phone-portrait-outline',
    title: 'Mobile Money',
    sub: 'Send to a mobile money wallet · arrives in minutes',
  },
  {
    id: 'bank',
    icon: 'business-outline',
    title: 'Bank Account',
    sub: 'Send to a bank account · within 1 business day',
  },
];

export function DeliveryMethodScreen() {
  const { corridor, set } = useSend();
  const choose = (id: DeliveryType) => {
    set({ deliveryType: id, recipientName: '', recipientAccount: '', recipientBank: '' });
    router.push('/(app)/send/recipient');
  };

  return (
    <Screen>
      <View className="pt-2">
        <BackButton fallback="/(app)/send/amount" />
      </View>
      <Text
        className="font-display-bold text-navy-deep mt-3"
        style={{ fontSize: 30, lineHeight: 34 }}
      >
        How will they receive the money?
      </Text>
      <Text className="font-sans text-body text-navy/55 mt-1">Sending to {corridor.country}.</Text>

      <View className="gap-3 mt-6">
        {METHODS.map((m) => (
          <Pressable
            key={m.id}
            onPress={() => choose(m.id)}
            className="rounded-card bg-white border border-border/60 p-4 flex-row items-center"
          >
            <View className="h-12 w-12 rounded-input bg-coral/10 items-center justify-center mr-3">
              <Ionicons name={m.icon} size={24} color={color.coral.DEFAULT} />
            </View>
            <View className="flex-1">
              <Text className="font-sans-bold text-base text-navy-deep">{m.title}</Text>
              <Text className="font-sans text-caption text-navy/50 mt-0.5">{m.sub}</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color={color.grey.light} />
          </Pressable>
        ))}
      </View>
    </Screen>
  );
}

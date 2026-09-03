// apps/mobile/src/features/menu/screens/SupportScreen.tsx
import { View, Text, ScrollView, Pressable } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Screen } from '@/shared/ui/Screen';
import { Button } from '@/shared/ui/Button';
import { color } from '@sr/design-tokens';

const TOPICS: { icon: keyof typeof Ionicons.glyphMap; label: string }[] = [
  { icon: 'shield-checkmark-outline', label: 'Account Verification and Limits' },
  { icon: 'paper-plane-outline', label: 'Sending Money' },
  { icon: 'person-remove-outline', label: 'Recipient Issues' },
  { icon: 'card-outline', label: 'Payment Methods' },
  { icon: 'gift-outline', label: 'Bonus Codes' },
  { icon: 'receipt-outline', label: 'Bills & Top-ups' },
  { icon: 'card-outline', label: 'Social Remit Card' },
];

export function SupportScreen() {
  return (
    <Screen>
      <View className="pt-2 flex-row items-center justify-between">
        <Text className="font-display-bold text-navy-deep" style={{ fontSize: 20 }}>
          How can we help you?
        </Text>
        <Pressable onPress={() => router.back()}>
          <Ionicons name="close" size={24} color={color.navy.deep} />
        </Pressable>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        className="flex-1 mt-4"
        contentContainerStyle={{ paddingBottom: 20 }}
      >
        {/* Featured FAQ */}
        <Pressable className="rounded-card bg-coral/5 border border-coral/20 px-4 py-4">
          <Text className="font-sans-bold text-base text-navy-deep">
            How can I refer someone to Social Remit?
          </Text>
          <Text className="font-sans text-caption text-navy/55 mt-1">
            Love sending with Social Remit? Refer your friends and family to Social Remit and
            receive…
          </Text>
        </Pressable>

        {/* Help topics */}
        <Text className="font-display-bold text-navy-deep mt-6 mb-1" style={{ fontSize: 18 }}>
          Help topics
        </Text>
        <View className="h-px bg-border-divider mb-1" />
        {TOPICS.map((t) => (
          <Pressable
            key={t.label}
            className="flex-row items-center gap-3 py-3.5 border-b border-border-divider"
          >
            <Ionicons name={t.icon} size={20} color={color.navy.deep} />
            <Text className="flex-1 font-sans-semibold text-base text-navy-deep">{t.label}</Text>
            <Ionicons name="chevron-forward" size={16} color={color.grey.light} />
          </Pressable>
        ))}

        <View className="mt-6">
          <Button label="Contact Support" onPress={() => {}} />
        </View>

        <Text className="font-sans text-caption text-navy/45 text-center mt-4 leading-5">
          Please be aware of potential fraud and scams. Follow our guidelines to protect your
          account: <Text className="text-coral font-sans-semibold">Learn more</Text>
        </Text>
      </ScrollView>
    </Screen>
  );
}

// apps/mobile/src/features/menu/screens/LegalScreen.tsx
import { View, Text, ScrollView, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Screen } from '@/shared/ui/Screen';
import { PageHeader } from '@/shared/ui/PageHeader';
import { color } from '@sr/design-tokens';

const DOCS = [
  'Terms of Service',
  'Privacy Policy',
  'Cookie Policy',
  'Complaints Policy',
  'Licences & regulatory',
  'Open-source licences',
];

export function LegalScreen() {
  return (
    <Screen>
      <ScrollView showsVerticalScrollIndicator={false} className="flex-1">
        <PageHeader title="Legal information" />
        <View className="mt-6">
          {DOCS.map((d) => (
            <Pressable
              key={d}
              className="flex-row items-center justify-between py-4 border-b border-border-divider"
            >
              <Text className="font-sans text-base text-navy-deep">{d}</Text>
              <Ionicons name="open-outline" size={16} color={color.grey.light} />
            </Pressable>
          ))}
        </View>
        <Text className="font-sans text-caption text-navy/45 leading-5 mt-6">
          Social Remit is a trading name of Social Remit Ltd, registered in England and Wales.
          Authorised and regulated for the provision of payment services in the UK. Your funds are
          safeguarded in line with applicable regulations.
        </Text>
        <View className="h-6" />
      </ScrollView>
    </Screen>
  );
}

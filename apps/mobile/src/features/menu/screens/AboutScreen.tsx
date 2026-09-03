// apps/mobile/src/features/menu/screens/AboutScreen.tsx
import { View, Text, ScrollView, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Screen } from '@/shared/ui/Screen';
import { PageHeader } from '@/shared/ui/PageHeader';
import { Logo } from '@/shared/ui/Logo';
import { SectionLabel } from '@/shared/ui/ListRow';
import { color } from '@sr/design-tokens';

function LinkRow({ icon, label }: { icon: keyof typeof Ionicons.glyphMap; label: string }) {
  return (
    <Pressable className="flex-row items-center gap-3 py-3.5 border-b border-border-divider">
      <Ionicons name={icon} size={18} color={color.coral.DEFAULT} />
      <Text className="flex-1 font-sans text-base text-navy-deep">{label}</Text>
      <Ionicons name="open-outline" size={16} color={color.grey.light} />
    </Pressable>
  );
}

export function AboutScreen() {
  return (
    <Screen>
      <ScrollView showsVerticalScrollIndicator={false} className="flex-1">
        <PageHeader title="About Social Remit" />

        <View className="items-center mt-8 gap-3">
          <Logo width={180} variant="lockup-coral" />
          <Text className="font-sans text-body text-navy/55 text-center px-6">
            The financial hub built by the diaspora, for the diaspora.
          </Text>
        </View>

        <Text className="font-sans text-body text-navy/70 leading-6 mt-8">
          Social Remit helps you send money home simply, quickly and affordably — and to stay
          connected to the people and places that matter. We’re building more than transfers: a way
          home.
        </Text>

        <SectionLabel>MORE</SectionLabel>
        <LinkRow icon="globe-outline" label="Visit our website" />
        <LinkRow icon="logo-instagram" label="Follow us" />
        <LinkRow icon="star-outline" label="Rate the app" />

        <View className="items-center mt-8 gap-1">
          <Text className="font-sans text-caption text-navy/40">Version 0.1.0</Text>
          <Text className="font-sans text-caption text-navy/40">
            UK-registered · Bank-grade security
          </Text>
        </View>
        <View className="h-6" />
      </ScrollView>
    </Screen>
  );
}

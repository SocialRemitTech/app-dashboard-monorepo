// apps/mobile/src/features/kyc/screens/VerifyIdentityScreen.tsx
import { View, Text, Pressable, ScrollView } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Screen } from '@/shared/ui/Screen';
import { Button } from '@/shared/ui/Button';
import { ContactSupportFooter } from '@/shared/ui/ContactSupportFooter';
import { color } from '@sr/design-tokens';

const POINTS: { icon: keyof typeof Ionicons.glyphMap; label: string }[] = [
  { icon: 'lock-closed-outline', label: 'Your information is secure' },
  { icon: 'time-outline', label: 'Takes less than a minute' },
  { icon: 'checkmark-circle-outline', label: 'Only needed once' },
];

export function VerifyIdentityScreen() {
  return (
    <Screen>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ flexGrow: 1 }}>
        <View className="pt-2">
          <Pressable
            onPress={() => router.back()}
            className="h-11 w-11 rounded-pill bg-white border border-border/60 items-center justify-center"
          >
            <Ionicons name="arrow-back" size={20} color={color.navy.deep} />
          </Pressable>
        </View>

        <Text
          className="font-display-bold text-navy-deep text-center mt-7"
          style={{ fontSize: 33 }}
        >
          Verify your identity
        </Text>

        <View
          className="rounded-card mt-6 px-5 py-6"
          style={{ backgroundColor: 'rgba(11,37,89,0.035)' }}
        >
          <Text className="font-sans text-navy-deep text-center" style={{ fontSize: 17 }}>
            We know extra steps can be frustrating.
          </Text>
          <Text
            className="font-sans text-navy/70 text-center mt-3"
            style={{ fontSize: 16, lineHeight: 24 }}
          >
            Before your first transfer, we need to verify your identity to help protect your account
            and keep your money safe.
          </Text>
        </View>

        <View className="mt-7 gap-5">
          {POINTS.map((p) => (
            <View key={p.label} className="flex-row items-center gap-3.5">
              <View
                className="h-11 w-11 rounded-pill items-center justify-center"
                style={{ backgroundColor: '#F2F0EC' }}
              >
                <Ionicons name={p.icon} size={21} color={color.navy.deep} />
              </View>
              <Text className="font-sans-semibold text-navy-deep" style={{ fontSize: 17 }}>
                {p.label}
              </Text>
            </View>
          ))}
        </View>

        <Pressable
          onPress={() => router.push('/(app)/account/why-verify' as never)}
          className="flex-row items-center justify-center gap-2 mt-9"
        >
          <Text className="font-sans-semibold text-navy-deep underline" style={{ fontSize: 17 }}>
            Why do we need this?
          </Text>
          <Ionicons name="arrow-forward" size={16} color={color.navy.deep} />
        </Pressable>

        <View className="flex-1" />
        <ContactSupportFooter />
      </ScrollView>

      <View className="pb-4">
        <Button
          label="Continue"
          onPress={() => router.push('/(app)/account/kyc-step-1' as never)}
        />
      </View>
    </Screen>
  );
}

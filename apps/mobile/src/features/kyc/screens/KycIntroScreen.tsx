// apps/mobile/src/features/kyc/screens/KycIntroScreen.tsx
import { View, Text } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Screen } from '@/shared/ui/Screen';
import { BackButton } from '@/shared/ui/BackButton';
import { Button } from '@/shared/ui/Button';
import { color } from '@sr/design-tokens';

const POINTS: { icon: keyof typeof Ionicons.glyphMap; label: string }[] = [
  { icon: 'lock-closed-outline', label: 'Your information is secure and encrypted' },
  { icon: 'flash-outline', label: 'Takes less than a minute' },
  { icon: 'checkmark-done-outline', label: 'Only needed once' },
];

export function KycIntroScreen() {
  return (
    <Screen>
      <View className="pt-2">
        <BackButton fallback="/(app)/send/recipient" />
      </View>

      <View className="items-center mt-6 gap-3">
        <View
          className="h-20 w-20 rounded-card items-center justify-center"
          style={{ backgroundColor: color.coral.DEFAULT }}
        >
          <Ionicons name="shield-checkmark" size={40} color={color.white} />
        </View>
        <Text className="font-display-bold text-navy-deep text-center" style={{ fontSize: 26 }}>
          Verify your identity
        </Text>
        <Text className="font-sans text-body text-navy/55 text-center px-2">
          We know extra steps can be frustrating. Before your first transfer, we need to verify your
          identity to help protect your account and keep your money safe.
        </Text>
      </View>

      <View className="mt-8 gap-3">
        {POINTS.map((p) => (
          <View
            key={p.label}
            className="flex-row items-center gap-3 rounded-card bg-white border border-border/60 px-4 py-3.5"
          >
            <View className="h-9 w-9 rounded-pill bg-coral/10 items-center justify-center">
              <Ionicons name={p.icon} size={18} color={color.coral.DEFAULT} />
            </View>
            <Text className="flex-1 font-sans text-body text-navy-deep">{p.label}</Text>
          </View>
        ))}
      </View>

      <View className="flex-1" />
      <View className="pb-6 gap-3">
        <Button label="Continue" onPress={() => router.push('/(app)/kyc/about-you')} />
        <Text className="text-center font-sans-medium text-caption text-coral">
          Why do we need this?
        </Text>
      </View>
    </Screen>
  );
}

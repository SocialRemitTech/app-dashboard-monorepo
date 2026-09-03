// apps/mobile/src/features/auth/screens/WelcomeScreen2.tsx
import { View, Text, Pressable } from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { RotatingHero } from '@/features/auth/components/RotatingHero';
import { Button } from '@/shared/ui/Button';
import { color } from '@sr/design-tokens';

/** Variant B: no separate intro — splash lands here, hero rotates behind a fixed card. */
const HERO_IMAGES = [
  require('@/../assets/welcome-hero.jpg'), // couple · "MORE THAN TRANSFERS"
  require('@/../assets/intro/slide3.png'), // coral · "Welcome to Social Remit"
];

export function WelcomeScreen2() {
  return (
    <View className="flex-1 bg-cream">
      <RotatingHero sources={HERO_IMAGES} height="62%" />

      <SafeAreaView edges={['bottom']} className="flex-1">
        <View
          className="flex-1 px-4 pt-8"
          style={{
            marginTop: -28,
            borderTopLeftRadius: 28,
            borderTopRightRadius: 28,
            backgroundColor: color.cream,
          }}
        >
          <Button label="Create Account" onPress={() => router.push('/(auth)/signup')} />
          <Text className="text-center font-sans-medium text-caption text-grey-mid mt-3">
            UK-registered. Bank-grade security
          </Text>
          <View className="mt-3">
            <Button
              label="Welcome Back"
              variant="outline"
              onPress={() => router.push('/(auth)/login')}
            />
          </View>
          <View className="flex-row items-center gap-3 my-5">
            <View className="flex-1 h-px bg-border" />
            <Text className="font-sans-semibold text-caption text-grey-light">Or sign up with</Text>
            <View className="flex-1 h-px bg-border" />
          </View>
          <View className="flex-row gap-3">
            <Social icon="logo-apple" onPress={() => router.push('/(auth)/signup')} />
            <Social icon="logo-google" onPress={() => router.push('/(auth)/signup')} />
          </View>
        </View>
      </SafeAreaView>
    </View>
  );
}

function Social({ icon, onPress }: { icon: 'logo-apple' | 'logo-google'; onPress: () => void }) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      className="flex-1 h-14 rounded-button items-center justify-center bg-white border border-border-form"
    >
      <Ionicons name={icon} size={24} color={color.navy.DEFAULT} />
    </Pressable>
  );
}

// apps/mobile/src/features/auth/screens/WelcomeScreen.tsx
import { View, Text, Pressable } from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Button } from '@/shared/ui/Button';
import { color } from '@sr/design-tokens';

/**
 * Hero uses a solid coral panel with the brand headline. Swap the hero View for an
 * <ImageBackground> with the couple photo (and expo-linear-gradient) when the asset lands.
 */
export function WelcomeScreen() {
  return (
    <View className="flex-1 bg-white">
      {/* Hero */}
      <View className="flex-1 bg-coral px-6 pt-20">
        <Text className="font-display-bold text-white" style={{ fontSize: 34, lineHeight: 38 }}>
          MORE THAN{'\n'}TRANSFERS.
        </Text>
        <Text className="font-display-bold" style={{ fontSize: 34, lineHeight: 38, color: color.cream }}>
          A way Home.
        </Text>
      </View>

      {/* Bottom card */}
      <SafeAreaView edges={['bottom']} className="bg-white">
        <View className="px-4 pt-8 pb-4 gap-3" style={{ marginTop: -28, borderTopLeftRadius: 28, borderTopRightRadius: 28, backgroundColor: color.white }}>
          <Button label="Create Account" onPress={() => router.push('/(auth)/signup')} />
          <Text className="text-center font-sans-medium text-caption text-grey-mid">
            UK-registered. Bank-grade security
          </Text>
          <Button label="Welcome Back" variant="outline" onPress={() => router.push('/(auth)/login')} />

          <View className="flex-row items-center gap-3 my-1">
            <View className="flex-1 h-px bg-border" />
            <Text className="font-sans-semibold text-caption text-grey-light">Or sign up with</Text>
            <View className="flex-1 h-px bg-border" />
          </View>

          <View className="flex-row gap-3">
            <SocialButton icon="logo-apple" onPress={() => router.push('/(auth)/signup')} />
            <SocialButton icon="logo-google" onPress={() => router.push('/(auth)/signup')} />
          </View>
        </View>
      </SafeAreaView>
    </View>
  );
}

function SocialButton({ icon, onPress }: { icon: 'logo-apple' | 'logo-google'; onPress: () => void }) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      className="flex-1 h-14 rounded-button items-center justify-center bg-white border border-border-form"
    >
      <Ionicons name={icon} size={22} color={color.navy.DEFAULT} />
    </Pressable>
  );
}

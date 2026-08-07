// apps/mobile/src/features/auth/screens/BiometricsScreen.tsx
import { View, Text, Pressable } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Screen } from '@/shared/ui/Screen';
import { BackButton } from '@/shared/ui/BackButton';
import { Button } from '@/shared/ui/Button';
import { biometrics } from '@/shared/platform/biometrics';
import { color } from '@sr/design-tokens';

export function BiometricsScreen() {
  const enable = async () => {
    const ok = await biometrics.isAvailable();
    if (ok) await biometrics.authenticate('Enable biometric unlock');
    router.push('/(auth)/greeting');
  };

  return (
    <Screen>
      <View className="pt-2 flex-row items-center justify-between">
        <BackButton />
        <Pressable><Text className="font-sans text-body text-navy/60">Need help?</Text></Pressable>
      </View>

      <View className="flex-1 items-center justify-center gap-6">
        <View className="items-center gap-2">
          <Text className="font-display-bold text-navy-deep text-center" style={{ fontSize: 26 }}>
            Use biometrics for{'\n'}quicker access
          </Text>
          <Text className="font-sans text-body text-navy/60">Sign in faster and more securely.</Text>
          <Text className="font-sans text-caption text-navy/50 mt-2">
            Your passcode will always work as a backup.
          </Text>
        </View>

        <View
          className="items-center justify-center"
          style={{ width: 140, height: 140, borderRadius: 32, backgroundColor: color.coral.DEFAULT }}
        >
          <Ionicons name="scan-outline" size={72} color={color.white} />
        </View>
      </View>

      <View className="pb-6 gap-4">
        <Button label="Enable Biometrics" onPress={enable} />
        <Pressable onPress={() => router.push('/(auth)/greeting')} className="flex-row items-center justify-center gap-2">
          <Text className="font-sans-semibold text-body text-navy/80">Not now</Text>
          <Ionicons name="arrow-forward" size={18} color={color.navy.DEFAULT} />
        </Pressable>
      </View>
    </Screen>
  );
}

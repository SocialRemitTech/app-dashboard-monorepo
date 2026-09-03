// apps/mobile/src/features/auth/screens/BiometricsScreen.tsx
import { View, Text, Pressable } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import * as LocalAuthentication from 'expo-local-authentication';
import { Screen } from '@/shared/ui/Screen';
import { Button } from '@/shared/ui/Button';
import { color } from '@sr/design-tokens';

export function BiometricsScreen() {
  const enable = async () => {
    try {
      const has = await LocalAuthentication.hasHardwareAsync();
      if (has)
        await LocalAuthentication.authenticateAsync({ promptMessage: 'Enable biometric sign-in' });
    } catch {
      /* user cancelled or unavailable */
    }
    router.push('/(auth)/greeting');
  };

  return (
    <Screen>
      <View className="flex-1 items-center justify-center px-2">
        <View
          className="h-20 w-20 rounded-card items-center justify-center"
          style={{ backgroundColor: color.coral.DEFAULT }}
        >
          <Ionicons name="scan" size={40} color={color.white} />
        </View>
        <Text
          className="font-display-bold text-navy-deep text-center mt-6"
          style={{ fontSize: 30, lineHeight: 36 }}
        >
          Use biometrics for{'\n'}quicker access
        </Text>
        <Text className="font-sans text-body text-navy/60 text-center mt-3">
          Sign in faster and more securely.
        </Text>
        <Text className="font-sans text-body text-navy/45 text-center mt-2">
          Your passcode will always work as backup.
        </Text>
      </View>

      <View className="pb-6 gap-3">
        <Button label="Enable biometrics" onPress={enable} />
        <Pressable
          onPress={() => router.push('/(auth)/greeting')}
          className="items-center py-2 flex-row justify-center gap-1"
        >
          <Text className="font-sans-semibold text-body text-navy-deep">Not now</Text>
          <Ionicons name="arrow-forward" size={16} color={color.navy.deep} />
        </Pressable>
        <Text className="font-sans text-caption text-navy/40 text-center">
          You can enable this later in Settings.
        </Text>
      </View>
    </Screen>
  );
}

// apps/mobile/app/(auth)/login.tsx — returning user (biometric/PIN unlock). Stub for now.
import { View, Text } from 'react-native';
import { Screen } from '@/shared/ui/Screen';
import { BackButton } from '@/shared/ui/BackButton';
export default function Login() {
  return (
    <Screen>
      <View className="pt-2"><BackButton /></View>
      <View className="flex-1 justify-center">
        <Text className="font-display-bold text-navy-deep" style={{ fontSize: 26 }}>Welcome back</Text>
        <Text className="font-sans text-body text-navy/60 mt-2">Biometric unlock → PIN fallback (next).</Text>
      </View>
    </Screen>
  );
}

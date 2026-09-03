// apps/mobile/src/features/auth/screens/SignInPausedScreen.tsx
import { useEffect, useState } from 'react';
import { View, Text } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Screen } from '@/shared/ui/Screen';
import { Button } from '@/shared/ui/Button';
import { usePasscode, secondsLeft } from '@/features/auth/stores/passcode.store';
import { color } from '@sr/design-tokens';

const RED_TINT = 'rgba(214,69,69,0.10)';

export function SignInPausedScreen() {
  const lockedUntil = usePasscode((s) => s.lockedUntil);
  const clearFailures = usePasscode((s) => s.clearFailures);
  const [left, setLeft] = useState(() => secondsLeft(lockedUntil));

  // Tick only. This screen never auto-navigates — that produced a redirect loop with Login.
  useEffect(() => {
    const t = setInterval(() => setLeft(secondsLeft(lockedUntil)), 1000);
    return () => clearInterval(t);
  }, [lockedUntil]);

  const expired = left <= 0;
  const mm = String(Math.floor(left / 60)).padStart(2, '0');
  const ss = String(left % 60).padStart(2, '0');

  const tryAgain = () => {
    clearFailures();
    router.replace('/(auth)/login');
  };

  return (
    <Screen>
      <View className="flex-1 items-center justify-center">
        <View
          className="rounded-pill items-center justify-center"
          style={{ width: 130, height: 130, backgroundColor: RED_TINT }}
        >
          <Ionicons name="lock-closed-outline" size={58} color="#D64545" />
        </View>

        <Text className="font-display-bold text-navy-deep mt-8" style={{ fontSize: 30 }}>
          Sign-in paused.
        </Text>
        <Text
          className="font-sans text-center mt-3 px-2"
          style={{ fontSize: 16, lineHeight: 24, color: '#9CA3AF' }}
        >
          Too many incorrect passcode attempts. Reset your passcode now or try again in 30 minutes.
        </Text>

        <View className="w-full mt-8">
          <Button
            label="Reset my passcode"
            onPress={() => router.push('/(auth)/forgot-passcode' as never)}
          />
        </View>

        {expired ? (
          <View className="w-full mt-3">
            <Button label="Try again" variant="secondary" onPress={tryAgain} />
          </View>
        ) : (
          <Text className="font-sans text-center mt-6" style={{ fontSize: 16, color: '#9CA3AF' }}>
            Try again in {mm}:{ss}
          </Text>
        )}
      </View>
    </Screen>
  );
}

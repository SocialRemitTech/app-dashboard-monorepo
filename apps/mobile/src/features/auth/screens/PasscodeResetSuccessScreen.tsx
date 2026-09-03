// apps/mobile/src/features/auth/screens/PasscodeResetSuccessScreen.tsx
import { useEffect, useRef } from 'react';
import { View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Screen } from '@/shared/ui/Screen';
import { Button } from '@/shared/ui/Button';
import { useSession } from '@/features/auth/stores/session.store';
import { usePasscode } from '@/features/auth/stores/passcode.store';
import { color } from '@sr/design-tokens';

const GREEN_TINT = 'rgba(46,155,99,0.10)';

/**
 * A completed reset signs the user in immediately — waiting first would leave the app
 * unauthenticated on an (auth) route, which can strand the user back on login.
 * The guard routes to Home as soon as status flips; this screen shows during that beat.
 */
export function PasscodeResetSuccessScreen() {
  const signIn = useSession((s) => s.signIn);
  const clearFailures = usePasscode((s) => s.clearFailures);
  const done = useRef(false);

  const enter = async () => {
    if (done.current) return;
    done.current = true;
    clearFailures(); // no lingering lockout after a successful reset
    await signIn({ accessToken: 'dev.access', refreshToken: 'dev.refresh', userId: 'me' });
  };

  useEffect(() => {
    void enter();
  }, []);

  return (
    <Screen>
      <View className="flex-1 items-center justify-center">
        <View
          className="rounded-pill items-center justify-center"
          style={{ width: 130, height: 130, backgroundColor: GREEN_TINT }}
        >
          <Ionicons name="checkmark" size={64} color="#2E9B63" />
        </View>
        <Text
          className="font-display-bold text-navy-deep text-center mt-8"
          style={{ fontSize: 30, lineHeight: 38 }}
        >
          Passcode updated
        </Text>
        <Text
          className="font-sans text-center mt-3 px-4"
          style={{ fontSize: 16, lineHeight: 24, color: '#9CA3AF' }}
        >
          You're signed in. Use your new passcode next time you sign in or approve a payment.
        </Text>
      </View>
      <View className="pb-8">
        <Button label="Continue to home" onPress={() => void enter()} />
      </View>
    </Screen>
  );
}

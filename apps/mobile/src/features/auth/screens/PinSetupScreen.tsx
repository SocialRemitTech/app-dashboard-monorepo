// apps/mobile/src/features/auth/screens/PinSetupScreen.tsx
import { useEffect, useRef, useState } from 'react';
import { View, Text, Pressable } from 'react-native';
import { router } from 'expo-router';
import { Screen } from '@/shared/ui/Screen';
import { BackButton } from '@/shared/ui/BackButton';
import { PinInput } from '@/shared/ui/PinInput';
import { TipCard } from '@/shared/ui/TipCard';
import { useOnboarding } from '@/features/auth/stores/onboarding.store';

export function PinSetupScreen() {
  const { set } = useOnboarding();
  const [pin, setPin] = useState('');
  const advanced = useRef(false);

  useEffect(() => {
    if (pin.length !== 5 || advanced.current) return;
    advanced.current = true;
    set({ pinDraft: pin });
    router.push('/(auth)/pin-confirm');
  }, [pin, set]);

  return (
    <Screen>
      <View className="pt-2 flex-row items-center justify-between">
        <BackButton fallback="/(auth)/otp" />
        <Pressable>
          <Text className="font-sans text-body text-navy/60">Need help?</Text>
        </Pressable>
      </View>
      <View className="mt-6 items-center gap-2">
        <Text className="font-display-bold text-navy-deep text-center" style={{ fontSize: 26 }}>
          Create your 5-digit{'\n'}passcode
        </Text>
        <Text className="font-sans text-body text-navy/60 text-center">
          You’ll use this to securely access your account.
        </Text>
      </View>
      <View className="mt-8">
        <PinInput value={pin} onChange={setPin} />
      </View>
      <View className="mt-8">
        <TipCard>Choose a PIN you can remember, but others can’t guess.</TipCard>
      </View>
    </Screen>
  );
}

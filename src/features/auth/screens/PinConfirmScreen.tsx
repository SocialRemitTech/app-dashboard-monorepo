// apps/mobile/src/features/auth/screens/PinConfirmScreen.tsx
import { useEffect, useRef, useState } from 'react';
import { View, Text, Pressable } from 'react-native';
import { router } from 'expo-router';
import { Screen } from '@/shared/ui/Screen';
import { BackButton } from '@/shared/ui/BackButton';
import { PinInput } from '@/shared/ui/PinInput';
import { TipCard } from '@/shared/ui/TipCard';
import { useOnboarding } from '@/features/auth/stores/onboarding.store';

export function PinConfirmScreen() {
  const { pinDraft } = useOnboarding();
  const [pin, setPin] = useState('');
  const [error, setError] = useState(false);
  const advanced = useRef(false);

  useEffect(() => {
    if (pin.length !== 5 || advanced.current) return;
    if (pin === pinDraft) {
      advanced.current = true;
      // Production: POST the PIN to set it server-side, then clear from memory.
      router.push('/(auth)/biometrics');
    } else {
      setError(true);
      const t = setTimeout(() => {
        setError(false);
        setPin('');
      }, 800);
      return () => clearTimeout(t);
    }
  }, [pin, pinDraft]);

  return (
    <Screen>
      <View className="pt-2 flex-row items-center justify-between">
        <BackButton fallback="/(auth)/pin-setup" />
        <Pressable>
          <Text className="font-sans text-body text-navy/60">Need help?</Text>
        </Pressable>
      </View>
      <View className="mt-6 items-center gap-2">
        <Text className="font-display-bold text-navy-deep" style={{ fontSize: 26 }}>
          Confirm your passcode
        </Text>
        <Text className="font-sans text-body text-navy/60">Enter your 5-digit passcode again.</Text>
      </View>
      <View className="mt-8">
        <PinInput value={pin} onChange={setPin} error={error} />
      </View>
      {error ? (
        <Text className="text-center font-sans-medium text-caption text-error mt-3">
          That didn’t match. Try again.
        </Text>
      ) : null}
      <View className="mt-8">
        <TipCard>Make sure you enter the same PIN you just created.</TipCard>
      </View>
    </Screen>
  );
}

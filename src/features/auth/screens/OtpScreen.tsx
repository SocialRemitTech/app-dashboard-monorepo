// apps/mobile/src/features/auth/screens/OtpScreen.tsx
import { useEffect, useRef, useState } from 'react';
import { View, Text, Pressable } from 'react-native';
import { router } from 'expo-router';
import { Screen } from '@/shared/ui/Screen';
import { BackButton } from '@/shared/ui/BackButton';
import { OtpInput } from '@/shared/ui/OtpInput';
import { TipCard } from '@/shared/ui/TipCard';
import { useOnboarding } from '@/features/auth/stores/onboarding.store';
import { useVerifyOtp } from '@/features/auth/api/auth.api';

export function OtpScreen() {
  const { countryCode, phone, set } = useOnboarding();
  const [code, setCode] = useState('');
  const [error, setError] = useState(false);
  const [seconds, setSeconds] = useState(30);
  const submitted = useRef(false); // guard: verify a completed code only once
  const verify = useVerifyOtp();

  useEffect(() => {
    if (seconds <= 0) return;
    const t = setTimeout(() => setSeconds((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [seconds]);

  useEffect(() => {
    if (code.length !== 6 || submitted.current) return;
    submitted.current = true;
    setError(false);
    verify.mutate(
      { requestId: 'req_1', code },
      {
        onSuccess: (tokens) => {
          set({ tokens });
          router.push('/(auth)/pin-setup');
        },
        onError: () => {
          setError(true);
          setCode('');
          submitted.current = false;
        },
      },
    );
  }, [code, verify, set]);

  const masked = `${countryCode}${phone}`.replace(/.(?=.{4})/g, '.');

  return (
    <Screen>
      <View className="pt-2">
        <BackButton fallback="/(auth)/signup" />
      </View>

      <View className="mt-10 gap-2">
        <Text className="font-display-bold text-navy-deep" style={{ fontSize: 28 }}>
          Confirm it’s you
        </Text>
        <Text className="font-sans text-body text-navy/60">
          Enter the 6-digit code sent to{' '}
          <Text className="font-sans-semibold text-navy">{masked}</Text>
        </Text>
      </View>

      <View className="mt-8">
        <OtpInput value={code} onChange={setCode} error={error} />
      </View>

      <View className="items-center mt-6 gap-1">
        <Pressable disabled={seconds > 0} onPress={() => setSeconds(30)}>
          <Text
            className={`font-sans-semibold text-body ${seconds > 0 ? 'text-grey-mid' : 'text-coral'}`}
          >
            {seconds > 0 ? `Resend code in ${seconds}s` : 'Resend Code'}
          </Text>
        </Pressable>
        <Pressable onPress={() => router.replace('/(auth)/signup')}>
          <Text className="font-sans text-body text-navy/60">Wrong number? Change it</Text>
        </Pressable>
      </View>

      {error ? (
        <Text className="text-center font-sans-medium text-caption text-error mt-4">
          Incorrect code. Please try again.
        </Text>
      ) : null}

      <View className="mt-8">
        <TipCard>
          Tip: Check your messages (including spam folder). Codes usually arrive within 30 seconds.
        </TipCard>
      </View>
    </Screen>
  );
}

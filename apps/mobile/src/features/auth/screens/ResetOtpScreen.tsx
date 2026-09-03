// apps/mobile/src/features/auth/screens/ResetOtpScreen.tsx
import { useEffect, useState } from 'react';
import { View, Text, Pressable } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { KeyboardAwareScreen } from '@/shared/ui/KeyboardAwareScreen';
import { Button } from '@/shared/ui/Button';
import { CodeField } from '@/shared/ui/CodeField';
import { useOnboarding } from '@/features/auth/stores/onboarding.store';
import { color } from '@sr/design-tokens';

const LEN = 6;

function maskPhone(raw: string) {
  const d = raw.replace(/\D/g, '');
  if (d.length < 5) return raw;
  return `${d[0]}••• ••• ${d.slice(-4)}`;
}

export function ResetOtpScreen() {
  const { phone, countryCode } = useOnboarding();
  const [code, setCode] = useState('');
  const [error, setError] = useState(false);
  const [seconds, setSeconds] = useState(53);

  useEffect(() => {
    const t = setInterval(() => setSeconds((s) => (s > 0 ? s - 1 : 0)), 1000);
    return () => clearInterval(t);
  }, []);

  const complete = code.length === LEN;
  const correct = complete && code !== '000000';

  const confirm = () => {
    if (!complete) return;
    if (!correct) {
      setError(true);
      return;
    }
    router.push('/(auth)/new-passcode' as never);
  };

  return (
    <KeyboardAwareScreen
      dismissOnTap={false}
      footer={
        <View className="pb-2">
          <Button label="Confirm" onPress={confirm} disabled={!complete} />
        </View>
      }
    >
      <View className="pt-2 flex-row items-center justify-between">
        <Pressable
          onPress={() => router.back()}
          className="h-11 w-11 rounded-pill bg-white border border-border/60 items-center justify-center"
        >
          <Ionicons name="arrow-back" size={20} color={color.navy.deep} />
        </Pressable>
        <Text className="font-sans-semibold text-navy-deep" style={{ fontSize: 15 }}>
          Get help
        </Text>
      </View>

      <Text className="font-display-bold text-navy-deep mt-7" style={{ fontSize: 33 }}>
        Confirm it's you
      </Text>
      <Text className="font-sans text-navy/60 mt-3" style={{ fontSize: 16, lineHeight: 24 }}>
        We've sent a 6-digit verification code to{' '}
        <Text className="font-sans-bold text-navy-deep">
          {countryCode} {maskPhone(phone)}
        </Text>
        . Enter it below.
      </Text>

      <View className="mt-9">
        <CodeField
          value={code}
          onChange={(v) => {
            setError(false);
            setCode(v);
          }}
          length={LEN}
          valid={error ? false : correct ? true : null}
        />
      </View>

      {error ? (
        <Text className="font-sans mt-3" style={{ fontSize: 14, color: '#D64545' }}>
          That code isn't right. Try again.
        </Text>
      ) : null}

      <Text className="font-sans text-center mt-7" style={{ fontSize: 16, color: '#9CA3AF' }}>
        {seconds > 0 ? (
          `Resend code in 00:${String(seconds).padStart(2, '0')}`
        ) : (
          <Text className="text-coral font-sans-semibold" onPress={() => setSeconds(53)}>
            Resend code
          </Text>
        )}
      </Text>

      <Text className="font-sans text-center mt-3 text-navy/55" style={{ fontSize: 15 }}>
        No longer have access to this number?{' '}
        <Text className="font-sans-bold text-navy-deep underline">Get help</Text>
      </Text>
    </KeyboardAwareScreen>
  );
}

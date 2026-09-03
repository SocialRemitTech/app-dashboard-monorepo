// apps/mobile/src/features/auth/screens/ForgotPasscodeScreen.tsx
import { useState } from 'react';
import { View, Text, Pressable } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { KeyboardAwareScreen } from '@/shared/ui/KeyboardAwareScreen';
import { Button } from '@/shared/ui/Button';
import { ValidatedField } from '@/shared/ui/ValidatedField';
import { useOnboarding } from '@/features/auth/stores/onboarding.store';
import { color } from '@sr/design-tokens';

export function ForgotPasscodeScreen() {
  const { countryCode, set } = useOnboarding();
  const [phone, setPhone] = useState('');
  const digits = phone.replace(/\D/g, '');
  const valid = digits.length >= 9 && digits.length <= 11;

  const send = () => {
    set({ phone });
    router.push('/(auth)/reset-otp' as never);
  };

  return (
    <KeyboardAwareScreen
      footer={
        <View className="pb-2">
          <Button label="Send verification code." onPress={send} disabled={!valid} />
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

      <Text
        className="font-display-bold text-navy-deep mt-7"
        style={{ fontSize: 33, lineHeight: 40 }}
      >
        Forgot your passcode?
      </Text>
      <Text className="font-sans text-navy/55 mt-2" style={{ fontSize: 16, lineHeight: 24 }}>
        Enter your registered mobile number and we'll send you a verification code.
      </Text>

      <Text className="font-sans-semibold text-navy-deep mt-8" style={{ fontSize: 15 }}>
        Mobile number
      </Text>
      <View className="mt-2 flex-row gap-3">
        <Pressable
          className="h-14 rounded-input bg-white px-3 flex-row items-center gap-1.5"
          style={{ borderWidth: 2, borderColor: color.border.DEFAULT }}
        >
          <Text style={{ fontSize: 18 }}>🇬🇧</Text>
          <Text className="font-sans-semibold text-navy-deep" style={{ fontSize: 16 }}>
            {countryCode}
          </Text>
          <Ionicons name="chevron-down" size={15} color={color.grey.mid} />
        </Pressable>
        <View className="flex-1">
          <ValidatedField
            value={phone}
            onChangeText={setPhone}
            placeholder="7123 456 789"
            keyboardType="phone-pad"
            valid={digits.length === 0 ? null : valid}
            errorText="Enter a valid mobile number"
          />
        </View>
      </View>

      <Text className="font-sans text-navy/45 mt-3" style={{ fontSize: 14, lineHeight: 20 }}>
        We'll text you a secure code. We'll never share your number.
      </Text>

      <Text className="font-sans text-navy/55 mt-4" style={{ fontSize: 15 }}>
        New to Social Remit?{' '}
        <Text
          className="font-sans-bold text-navy-deep underline"
          onPress={() => router.replace('/(auth)/signup')}
        >
          Create an account.
        </Text>
      </Text>
    </KeyboardAwareScreen>
  );
}

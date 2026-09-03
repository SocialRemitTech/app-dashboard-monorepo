// apps/mobile/src/features/auth/screens/SignUpScreen.tsx
import { useState } from 'react';
import { View, Text, Pressable } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { KeyboardAwareScreen } from '@/shared/ui/KeyboardAwareScreen';
import { Button } from '@/shared/ui/Button';
import { ValidatedField } from '@/shared/ui/ValidatedField';
import { useOnboarding } from '@/features/auth/stores/onboarding.store';
import { color } from '@sr/design-tokens';

export function SignUpScreen() {
  const { phone, referral, countryCode, set } = useOnboarding();
  const [touched, setTouched] = useState(false);
  const digits = phone.replace(/\D/g, '');
  const phoneValid = digits.length >= 9 && digits.length <= 11;
  const referralValid = referral.trim().length === 0 ? null : referral.trim().length >= 4;

  const next = () => {
    setTouched(true);
    if (phoneValid) router.push('/(auth)/otp');
  };

  return (
    <KeyboardAwareScreen
      footer={
        <View className="pb-2">
          <Button label="Next" onPress={next} disabled={!phoneValid} />
          <Pressable
            onPress={() => router.push('/(auth)/login')}
            className="rounded-card bg-white border border-border/60 items-center py-4 mt-3"
          >
            <Text className="font-sans text-navy/60" style={{ fontSize: 15 }}>
              Already have an account?{' '}
              <Text className="font-sans-bold text-navy-deep underline">Log in instead</Text>
            </Text>
          </Pressable>
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
        <Text className="font-sans text-body text-navy/55">Get help</Text>
      </View>

      <Text
        className="font-display-bold text-navy-deep mt-6"
        style={{ fontSize: 34, lineHeight: 40 }}
      >
        Let's get you started
      </Text>
      <Text className="font-sans text-body text-navy/60 mt-2">Get set up in under a minute.</Text>

      <View className="mt-7 flex-row gap-3">
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
            onChangeText={(t) => set({ phone: t })}
            placeholder="7123 456 789"
            keyboardType="phone-pad"
            valid={touched || digits.length > 0 ? phoneValid : null}
            errorText="Enter a valid mobile number"
          />
        </View>
      </View>
      <Text className="font-sans text-caption text-navy/45 mt-2.5" style={{ lineHeight: 18 }}>
        We'll send a code to confirm it's you. We'll never share your number.
      </Text>

      <Text className="font-sans-bold text-navy-deep mt-7" style={{ fontSize: 15 }}>
        Referral code <Text className="font-sans text-navy/40">(optional)</Text>
      </Text>
      <View className="mt-2">
        <ValidatedField
          value={referral}
          onChangeText={(t) => set({ referral: t })}
          placeholder="Enter referral code"
          autoCapitalize="characters"
          valid={referralValid}
        />
      </View>
      <Text className="font-sans text-caption text-navy/45 mt-2.5">
        Enter the code from the person who invited you.
      </Text>
    </KeyboardAwareScreen>
  );
}

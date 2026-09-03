// apps/mobile/src/features/kyc/screens/EmailStepScreen.tsx
import { useState } from 'react';
import { View, Text, Pressable } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { KeyboardAwareScreen } from '@/shared/ui/KeyboardAwareScreen';
import { Button } from '@/shared/ui/Button';
import { ValidatedField } from '@/shared/ui/ValidatedField';
import { ContactSupportFooter } from '@/shared/ui/ContactSupportFooter';
import { useAccountState } from '@/features/profile/stores/accountState.store';
import { color } from '@sr/design-tokens';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function EmailStepScreen() {
  const setDetails = useAccountState((s) => s.setDetails);
  const markStepDone = useAccountState((s) => s.markStepDone);
  const resumeRoute = useAccountState((s) => s.resumeRoute);
  const [email, setEmail] = useState('');
  const valid = EMAIL_RE.test(email.trim());

  const next = () => {
    setDetails({ emailAddress: email.trim(), emailConfirmed: true });
    markStepDone('email');
    router.replace(resumeRoute() as never);
  };

  return (
    <KeyboardAwareScreen
      footer={
        <View className="pb-2">
          <Button label="Continue" onPress={next} disabled={!valid} />
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
          Need help?
        </Text>
      </View>

      <Text className="font-display-bold text-navy-deep text-center mt-7" style={{ fontSize: 31 }}>
        What's your email?
      </Text>
      <Text className="font-sans text-navy/55 text-center mt-2" style={{ fontSize: 16 }}>
        We'll send transfer receipts and important account updates here.
      </Text>

      <View className="mt-7">
        <ValidatedField
          label="Email address"
          value={email}
          onChangeText={setEmail}
          placeholder="you@example.com"
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
          valid={email.length === 0 ? null : valid}
          errorText="Enter a valid email address"
        />
      </View>

      <ContactSupportFooter />
    </KeyboardAwareScreen>
  );
}

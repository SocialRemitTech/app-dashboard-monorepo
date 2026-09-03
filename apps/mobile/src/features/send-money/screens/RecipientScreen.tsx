// apps/mobile/src/features/send-money/screens/RecipientScreen.tsx
import { View, Text, TextInput, Pressable } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { KeyboardAwareScreen } from '@/shared/ui/KeyboardAwareScreen';
import { BackButton } from '@/shared/ui/BackButton';
import { Button } from '@/shared/ui/Button';
import { useSend } from '@/features/send-money/stores/send.store';
import { color } from '@sr/design-tokens';

export function RecipientScreen() {
  const s = useSend();
  const isBank = s.deliveryType === 'bank';
  const canContinue = isBank
    ? s.recipientName.trim().length > 1 &&
      s.recipientBank.trim().length > 0 &&
      s.recipientAccount.trim().length >= 6
    : s.recipientAccount.trim().length >= 9;

  const next = () => router.push(isBank ? '/(app)/send/recipient-verify' : '/(app)/send/kyc-gate');

  return (
    <KeyboardAwareScreen
      footer={
        <View className="pb-2">
          <Button label="Continue" onPress={next} disabled={!canContinue} />
        </View>
      }
    >
      <View className="pt-2">
        <BackButton fallback="/(app)/send/delivery" />
      </View>
      <Text className="font-display-bold text-navy-deep mt-3" style={{ fontSize: 28 }}>
        Who are you sending to?
      </Text>
      <Text className="font-sans text-body text-navy/55 mt-1">
        {isBank
          ? 'Enter your recipient’s bank details.'
          : 'Enter your recipient’s mobile money number.'}
      </Text>

      {isBank ? (
        <View className="mt-6 gap-4">
          <Field label="Recipient full name">
            <TextInput
              value={s.recipientName}
              onChangeText={(t) => s.set({ recipientName: t })}
              placeholder="e.g. Kofi Owusu"
              placeholderTextColor={color.grey.light}
              className="font-sans text-base text-navy"
            />
          </Field>
          <Field label="Bank">
            <TextInput
              value={s.recipientBank}
              onChangeText={(t) => s.set({ recipientBank: t })}
              placeholder="Select bank"
              placeholderTextColor={color.grey.light}
              className="font-sans text-base text-navy"
            />
          </Field>
          <Field label="Account number">
            <TextInput
              value={s.recipientAccount}
              onChangeText={(t) => s.set({ recipientAccount: t.replace(/[^\d]/g, '') })}
              keyboardType="number-pad"
              placeholder="Account number"
              placeholderTextColor={color.grey.light}
              className="font-sans text-base text-navy"
            />
          </Field>
        </View>
      ) : (
        <View className="mt-6 gap-4">
          <Field label="Recipient full name">
            <TextInput
              value={s.recipientName}
              onChangeText={(t) => s.set({ recipientName: t })}
              placeholder="e.g. Ama Mensah"
              placeholderTextColor={color.grey.light}
              className="font-sans text-base text-navy"
            />
          </Field>
          <Field label="Mobile money number">
            <View className="flex-row items-center gap-2">
              <Text className="font-sans-semibold text-base text-navy/70">🇬🇭 +233</Text>
              <TextInput
                value={s.recipientAccount}
                onChangeText={(t) => s.set({ recipientAccount: t.replace(/[^\d]/g, '') })}
                keyboardType="number-pad"
                placeholder="24 123 4567"
                placeholderTextColor={color.grey.light}
                className="flex-1 font-sans text-base text-navy"
                maxLength={9}
              />
            </View>
          </Field>
        </View>
      )}
    </KeyboardAwareScreen>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <View>
      <Text className="font-sans-medium text-label text-navy/55 mb-1.5">{label}</Text>
      <View className="h-14 rounded-input bg-white border-2 border-border px-4 justify-center">
        {children}
      </View>
    </View>
  );
}

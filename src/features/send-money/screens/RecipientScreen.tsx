// apps/mobile/src/features/send-money/screens/RecipientScreen.tsx
import { View, Text, Pressable } from 'react-native';
import { router } from 'expo-router';
import { Screen } from '@/shared/ui/Screen';
import { BackButton } from '@/shared/ui/BackButton';
import { Button } from '@/shared/ui/Button';
import { TextField } from '@/shared/ui/TextField';
import { useSend } from '@/features/send-money/stores/send.store';
import { useKyc } from '@/features/kyc/stores/kyc.store';
import { evaluateKycGate } from '@sr/domain';

/** Fields are shaped by delivery method (config-driven in production). Ghana = mobile wallet. */
const FIELD_LABEL: Record<string, string> = {
  mobile_wallet: 'Mobile money number',
  bank: 'Account number',
  cash_pickup: 'Recipient phone',
  account_credit: 'Account number',
};

export function RecipientScreen() {
  const { corridor, deliveryType, recipientName, recipientAccount, sendAmountMinor, set } =
    useSend();
  const kyc = useKyc((s) => s.status);
  const valid = recipientName.trim().length > 1 && recipientAccount.trim().length >= 6;

  const onContinue = () => {
    // The KYC GATE (domain rule). Verified → payment; otherwise → KYC detour, then payment.
    const decision = evaluateKycGate({
      kycStatus: kyc,
      sendAmountMinor,
      toCountry: corridor.id.split('-')[1]?.toUpperCase() ?? 'GH',
      requiredCorridorLevel: 'basic',
    });
    router.push(decision.action === 'proceed' ? '/(app)/send/payment' : '/(app)/send/kyc');
  };

  return (
    <Screen>
      <View className="pt-2">
        <BackButton fallback="/(app)/send/amount" />
      </View>
      <Text
        className="font-display-bold text-navy-deep mt-3"
        style={{ fontSize: 30, lineHeight: 34 }}
      >
        Who’s receiving?
      </Text>
      <Text className="font-sans text-body text-navy/55 mt-1">Sending to {corridor.country}.</Text>

      <View className="mt-8 gap-6">
        <TextField
          label="Recipient name"
          value={recipientName}
          onChangeText={(t) => set({ recipientName: t })}
          placeholder="e.g. Kwame Mensah"
        />
        <TextField
          label={FIELD_LABEL[deliveryType] ?? 'Account'}
          value={recipientAccount}
          onChangeText={(t) => set({ recipientAccount: t })}
          placeholder="Enter number"
          keyboardType="number-pad"
        />
      </View>

      <View className="flex-1" />
      <View className="pb-4">
        <Button label="Continue" onPress={onContinue} disabled={!valid} />
      </View>
    </Screen>
  );
}

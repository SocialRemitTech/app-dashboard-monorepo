// apps/mobile/src/features/send-money/screens/KycGateScreen.tsx
import { Redirect } from 'expo-router';
import { evaluateKycGate } from '@sr/domain';
import { useSend } from '@/features/send-money/stores/send.store';
import { useKyc } from '@/features/kyc/stores/kyc.store';

/** Single decision point: verified users go to payment, everyone else into the KYC flow. */
export function KycGateScreen() {
  const { corridor, sendAmountMinor } = useSend();
  const kycStatus = useKyc((s) => s.status);

  const decision = evaluateKycGate({
    kycStatus,
    sendAmountMinor,
    toCountry: corridor.id.split('-')[1]?.toUpperCase() ?? 'GH',
    requiredCorridorLevel: 'basic',
  });

  return (
    <Redirect
      href={(decision.action === 'proceed' ? '/(app)/send/payment' : '/(app)/kyc') as never}
    />
  );
}

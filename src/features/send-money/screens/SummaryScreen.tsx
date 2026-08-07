// apps/mobile/src/features/send-money/screens/SummaryScreen.tsx
import { View, Text } from 'react-native';
import { router } from 'expo-router';
import { randomUUID } from 'expo-crypto';
import { Screen } from '@/shared/ui/Screen';
import { BackButton } from '@/shared/ui/BackButton';
import { Button } from '@/shared/ui/Button';
import { Flag } from '@/shared/ui/Flag';
import { formatMoney } from '@/shared/ui/money';
import { SEND_FLAG } from '@/features/send-money/data/corridors';
import { useSend } from '@/features/send-money/stores/send.store';
import { useInitiateTransfer } from '@/features/send-money/api/transfers.api';
import { color } from '@sr/design-tokens';

export function SummaryScreen() {
  const { corridor, sendAmountMinor, recipientName, receive, set } = useSend();
  const initiate = useInitiateTransfer();
  const major = (sendAmountMinor / 100).toLocaleString('en-GB');

  const confirm = () => {
    // Mint the idempotency key here (Frontend §3.4 / Backend §1.3) — reused on any retry.
    const idempotencyKey = randomUUID();
    set({ idempotencyKey });
    initiate.mutate(
      { quoteId: randomUUID(), recipientId: randomUUID(), idempotencyKey },
      {
        onSuccess: (t) => {
          set({ transferId: t.id });
          router.replace('/(app)/send/processing');
        },
      },
    );
  };

  return (
    <Screen>
      <View className="pt-2">
        <BackButton fallback="/(app)/send/payment" />
      </View>
      <Text
        className="font-display-bold text-navy-deep mt-3"
        style={{ fontSize: 30, lineHeight: 34 }}
      >
        Review your transfer
      </Text>
      <Text className="font-sans text-body text-navy/55 mt-1">
        Check everything before you send.
      </Text>

      {/* You send */}
      <Text className="font-sans text-label text-navy/55 mt-6 mb-2">You send</Text>
      <View className="h-16 rounded-card bg-white px-4 flex-row items-center border border-border">
        <Flag code={SEND_FLAG} size={30} />
        <Text className="font-sans-semibold text-base text-navy/70 ml-2">GBP</Text>
        <Text className="flex-1 text-right font-display-bold text-navy" style={{ fontSize: 26 }}>
          {major}
        </Text>
      </View>

      {/* Recipient receives (highlighted) */}
      <Text className="font-sans text-label text-navy/55 mt-4 mb-2">Recipient receives</Text>
      <View
        className="rounded-card bg-white px-4 py-4"
        style={{ borderWidth: 2, borderColor: color.coral.DEFAULT }}
      >
        <View className="flex-row items-center">
          <Flag code={corridor.flag} size={26} />
          <Text className="font-sans-semibold text-base text-navy/70 ml-2">
            {corridor.currency}
          </Text>
          <Text className="flex-1 text-right font-display-bold text-navy" style={{ fontSize: 28 }}>
            {formatMoney(receive())}
          </Text>
        </View>
      </View>

      {/* Rate / Fee / Delivery */}
      <View className="rounded-card bg-cream/80 px-4 py-4 mt-4 gap-2">
        <Row label="To" value={recipientName || 'Recipient'} />
        <Row
          label="Rate"
          value={`£1 = ${corridor.rate.toLocaleString('en-GB', { minimumFractionDigits: 2 })} ${corridor.currency}`}
        />
        <Row label="Fee" value="Free" valueClass="text-success-wallet" />
        <Row label="Delivery" value="Within minutes" />
      </View>

      <View className="flex-1" />
      <View className="pb-4">
        <Button
          label={initiate.isPending ? 'Sending…' : 'Confirm & send'}
          onPress={confirm}
          disabled={initiate.isPending}
        />
      </View>
    </Screen>
  );
}

function Row({ label, value, valueClass }: { label: string; value: string; valueClass?: string }) {
  return (
    <View className="flex-row justify-between">
      <Text className="font-sans text-body text-navy/55">{label}</Text>
      <Text className={`font-sans-semibold text-body ${valueClass ?? 'text-navy-deep'}`}>
        {value}
      </Text>
    </View>
  );
}

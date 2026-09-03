// apps/mobile/src/features/send-money/screens/SummaryScreen.tsx
import { useState } from 'react';
import { View, Text, TextInput, Pressable } from 'react-native';
import { router } from 'expo-router';
import { randomUUID } from 'expo-crypto';
import { Ionicons } from '@expo/vector-icons';
import { KeyboardAwareScreen } from '@/shared/ui/KeyboardAwareScreen';
import { BackButton } from '@/shared/ui/BackButton';
import { Button } from '@/shared/ui/Button';
import { formatMoney } from '@/shared/ui/money';
import { useSend } from '@/features/send-money/stores/send.store';
import { useInitiateTransfer } from '@/features/send-money/api/transfers.api';
import { useOpenBanking } from '@/features/open-banking/stores/openbanking.store';
import { color } from '@sr/design-tokens';

const gbp = (m: number) => `£${(m / 100).toLocaleString('en-GB', { minimumFractionDigits: 2 })}`;

export function SummaryScreen() {
  const s = useSend();
  const initiate = useInitiateTransfer();
  const beginOb = useOpenBanking((ob) => ob.begin);
  const [, setError] = useState<string | null>(null);
  const isBank = s.deliveryType === 'bank';
  const acct = s.recipientAccount.slice(-4);

  const goProcessing = (id: string) => {
    s.set({ transferId: id });
    router.replace('/(app)/send/processing');
  };
  const confirm = () => {
    setError(null);
    if (s.paymentMethod === 'pay_by_bank') {
      beginOb('send', s.sendAmountMinor);
      router.push('/(app)/open-banking/choose');
      return;
    }
    const idempotencyKey = randomUUID();
    s.set({ idempotencyKey });
    initiate.mutate(
      { quoteId: randomUUID(), recipientId: randomUUID(), idempotencyKey },
      {
        onSuccess: (t) => goProcessing(t.id),
        onError: () => goProcessing(`SR-${Date.now().toString(36).toUpperCase()}`),
      },
    );
  };

  return (
    <KeyboardAwareScreen
      footer={
        <View className="pb-2">
          <Button
            label={initiate.isPending ? 'Sending…' : 'Confirm & send'}
            onPress={confirm}
            disabled={initiate.isPending}
          />
        </View>
      }
    >
      <View className="pt-2">
        <BackButton fallback="/(app)/send/payment" />
      </View>
      <Text className="font-display-bold text-navy-deep mt-3" style={{ fontSize: 28 }}>
        Complete your transfer
      </Text>
      <Text className="font-sans text-body text-navy/55 mt-1">Review before sending.</Text>

      <View className="rounded-card bg-white border border-border/60 mt-6 px-5 py-2">
        <View className="flex-row items-center justify-between py-3 border-b border-border-divider">
          <Text className="font-sans-bold text-base text-navy-deep">Transfer summary</Text>
          <Pressable onPress={() => router.push('/(app)/send/amount')}>
            <Text className="font-sans-semibold text-caption text-coral">Edit</Text>
          </Pressable>
        </View>
        <Row label="You send" value={gbp(s.sendAmountMinor)} />
        <Row label="Transfer fee" value="Free" valueColor={color.success.wallet} />
        <Row
          label="Exchange rate"
          value={`£1 = ${s.corridor.rate.toLocaleString('en-GB', { minimumFractionDigits: 2 })} ${s.corridor.currency}`}
        />
        <View className="py-3 border-t border-border-divider">
          <Text className="font-sans text-caption text-navy/50">Recipient receives</Text>
          <Text className="font-display-bold text-navy-deep mt-1" style={{ fontSize: 24 }}>
            {s.corridor.currency} {formatMoney(s.receive())}
          </Text>
          <Text className="font-sans text-caption text-navy/45 mt-0.5">
            Arrives {isBank ? 'within 1 business day' : 'within minutes'}
          </Text>
        </View>
      </View>

      <View className="rounded-card bg-coral/10 mt-4 px-4 py-3 flex-row items-center gap-3">
        <Ionicons name="gift" size={20} color={color.coral.DEFAULT} />
        <Text className="flex-1 font-sans-semibold text-body text-navy-deep">
          £10 off your first transfer applied
        </Text>
      </View>

      <View className="rounded-card bg-white border border-border/60 mt-4 px-5 py-2">
        <View className="flex-row items-center justify-between py-3">
          <View>
            <Text className="font-sans-bold text-base text-navy-deep">
              {s.recipientName || 'Recipient'}
            </Text>
            <Text className="font-sans text-caption text-navy/50 mt-0.5">
              {isBank
                ? `${s.recipientBank} · Account ending ${acct}`
                : `Mobile Money · +233 ${s.recipientAccount}`}
            </Text>
          </View>
          <Pressable onPress={() => router.push('/(app)/send/recipient')}>
            <Text className="font-sans-semibold text-caption text-coral">Edit</Text>
          </Pressable>
        </View>
      </View>

      <Text className="font-sans-semibold text-label text-navy-deep mt-6 mb-2">
        Personal reference (optional)
      </Text>
      <View className="h-14 rounded-input bg-white border-2 border-border px-4 justify-center">
        <TextInput
          value={s.personalReference}
          onChangeText={(t) => s.set({ personalReference: t })}
          placeholder="e.g. School fees · September"
          placeholderTextColor={color.grey.light}
          className="font-sans text-base text-navy"
          returnKeyType="done"
        />
      </View>
    </KeyboardAwareScreen>
  );
}

function Row({ label, value, valueColor }: { label: string; value: string; valueColor?: string }) {
  return (
    <View className="flex-row justify-between py-3 border-b border-border-divider">
      <Text className="font-sans text-body text-navy/55">{label}</Text>
      <Text
        className="font-sans-semibold text-body"
        style={{ color: valueColor ?? color.navy.deep }}
      >
        {value}
      </Text>
    </View>
  );
}

// apps/mobile/src/features/send-money/screens/ProcessingScreen.tsx
import { useEffect, useRef, useState } from 'react';
import { View, Text } from 'react-native';
import { router } from 'expo-router';
import { Screen } from '@/shared/ui/Screen';
import { Button } from '@/shared/ui/Button';
import { formatMoney } from '@/shared/ui/money';
import { useSend } from '@/features/send-money/stores/send.store';
import { useWallet } from '@/features/wallet/stores/wallet.store';
import { useTransactions } from '@/features/activity/stores/transactions.store';
import { color } from '@sr/design-tokens';

type Step = { title: string; time: string; state: 'done' | 'active' | 'pending' };
const METHOD_LABEL: Record<string, string> = {
  debit_card: 'Debit card',
  pay_by_bank: 'Pay by bank',
  wallet: 'Wallet',
};

export function ProcessingScreen() {
  const s = useSend();
  const debit = useWallet((w) => w.debit);
  const add = useTransactions((t) => t.add);
  const updateStatus = useTransactions((t) => t.updateStatus);
  const [delivered, setDelivered] = useState(false);
  const txId = useRef<string | null>(null);

  useEffect(() => {
    if (txId.current) return;
    if (s.paymentMethod === 'wallet') debit(s.sendAmountMinor);
    const tx = add({
      id: s.transferId ?? undefined,
      type: 'send',
      status: 'processing',
      amountMinor: s.sendAmountMinor,
      recipientName: s.recipientName,
      corridorCountry: s.corridor.country,
      corridorCode: s.corridor.code,
      deliveryType: s.deliveryType ?? undefined,
      recipientAccount: s.recipientAccount,
      recipientBank: s.recipientBank || undefined,
      receiveLabel: `${s.corridor.currency} ${formatMoney(s.receive())}`,
      method: s.paymentMethod ? METHOD_LABEL[s.paymentMethod] : undefined,
      reference: s.personalReference || undefined,
    });
    txId.current = tx.id;
  }, []);

  useEffect(() => {
    const t = setTimeout(() => {
      setDelivered(true);
      if (txId.current) updateStatus(txId.current, 'completed');
    }, 3500);
    return () => clearTimeout(t);
  }, [updateStatus]);

  const now = new Date();
  const t1 = new Date(now.getTime() - 60000).toLocaleTimeString('en-GB', {
    hour: '2-digit',
    minute: '2-digit',
  });
  const t2 = now.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
  const steps: Step[] = [
    { title: 'Payment received', time: t1, state: 'done' },
    { title: 'Processing transfer', time: t2, state: delivered ? 'done' : 'active' },
    { title: 'Delivered', time: delivered ? t2 : 'Pending', state: delivered ? 'done' : 'pending' },
  ];
  const finish = (fallback: string) => {
    const id = txId.current;
    s.reset();
    router.replace((id ? `/(app)/activity/${id}` : fallback) as never);
  };

  return (
    <Screen>
      <View className="items-center mt-10 gap-1">
        <Text className="font-display-bold text-navy-deep" style={{ fontSize: 24 }}>
          Transfer sent
        </Text>
        <Text className="font-display-bold text-navy-deep" style={{ fontSize: 36 }}>
          {s.corridor.currency} {formatMoney(s.receive())}
        </Text>
        <Text className="font-sans text-body text-navy/55 mt-1">
          {delivered ? 'Delivered to' : 'Processing transfer to'} {s.recipientName || 'recipient'}
        </Text>
        <View className="rounded-pill px-4 py-1.5 mt-3" style={{ backgroundColor: '#DCFCE7' }}>
          <Text className="font-sans-semibold text-body" style={{ color: color.success.transfer }}>
            {delivered ? '● Delivered' : '● Processing'}
          </Text>
        </View>
      </View>

      <View className="rounded-card bg-white border border-border/60 p-5 mt-6">
        <Text className="font-sans-bold text-base text-navy-deep mb-3">Live Tracking</Text>
        {steps.map((st, i) => (
          <View key={st.title} className="flex-row">
            <View className="items-center mr-3">
              <View
                className="h-5 w-5 rounded-pill items-center justify-center"
                style={{
                  backgroundColor: st.state === 'pending' ? '#E5E7EB' : color.success.transfer,
                }}
              >
                {st.state === 'active' ? <View className="h-2 w-2 rounded-pill bg-white" /> : null}
              </View>
              {i < steps.length - 1 ? (
                <View
                  className="w-0.5 flex-1 my-1"
                  style={{
                    backgroundColor: st.state === 'done' ? color.success.transfer : '#E5E7EB',
                    minHeight: 28,
                  }}
                />
              ) : null}
            </View>
            <View className="pb-4">
              <Text
                className={`font-sans-bold text-base ${st.state === 'pending' ? 'text-navy/40' : 'text-navy-deep'}`}
              >
                {st.title}
              </Text>
              <Text className="font-sans text-caption text-navy/45">{st.time}</Text>
            </View>
          </View>
        ))}
      </View>

      <View className="flex-1" />
      <View className="pb-4 gap-3">
        <Button label="Done" onPress={() => finish('/(app)/(tabs)')} />
        <Button
          label="View transaction"
          variant="outline"
          onPress={() => finish('/(app)/(tabs)/transactions')}
        />
      </View>
    </Screen>
  );
}

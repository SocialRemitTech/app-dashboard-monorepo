// apps/mobile/src/features/activity/screens/TransactionDetailScreen.tsx
import { View, Text, ScrollView, Pressable } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Screen } from '@/shared/ui/Screen';
import { BackButton } from '@/shared/ui/BackButton';
import { Button } from '@/shared/ui/Button';
import { useTransactions } from '@/features/activity/stores/transactions.store';
import { useSend, type DeliveryType } from '@/features/send-money/stores/send.store';
import { useWallet, gbp } from '@/features/wallet/stores/wallet.store';
import { corridors } from '@/features/send-money/data/corridors';
import { shareReceipt, shareWhatsApp, shareMessage } from '@/features/activity/shareReceipt';
import { color } from '@sr/design-tokens';

const STATUS = {
  completed: { label: 'Delivered', fg: '#2E9E6F', icon: 'checkmark-circle' as const },
  processing: { label: 'Processing', fg: '#F59E0B', icon: 'time' as const },
  failed: { label: 'Failed', fg: '#DC2626', icon: 'close-circle' as const },
};

export function TransactionDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const tx = useTransactions((s) => s.transactions.find((t) => t.id === id));
  const send = useSend();
  const setTopupAmount = useWallet((s) => s.setTopupAmount);

  if (!tx) {
    return (
      <Screen>
        <View className="pt-2">
          <BackButton fallback="/(app)/(tabs)/transactions" />
        </View>
        <View className="flex-1 items-center justify-center">
          <Text className="font-sans text-body text-navy/50">Transaction not found.</Text>
        </View>
      </Screen>
    );
  }

  const isTopup = tx.type === 'topup';
  const st = STATUS[tx.status];
  const corridor = corridors.find((c) => c.code === tx.corridorCode);
  const when = new Date(tx.createdAt).toLocaleString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
  const deliveryLabel =
    tx.deliveryType === 'bank'
      ? `Bank transfer${tx.recipientBank ? ' · ' + tx.recipientBank : ''}`
      : 'Mobile money';

  const sendAgain = () => {
    if (corridor) send.setCorridor(corridor);
    send.set({
      sendAmountMinor: tx.amountMinor,
      deliveryType: (tx.deliveryType as DeliveryType) ?? 'mobile_wallet',
      recipientName: tx.recipientName ?? '',
      recipientAccount: tx.recipientAccount ?? '',
      recipientBank: tx.recipientBank ?? '',
      paymentMethod: null,
      idempotencyKey: null,
      transferId: null,
    });
    router.push('/(app)/send/payment');
  };
  const addAgain = () => {
    setTopupAmount(tx.amountMinor);
    router.push('/(app)/wallet/top-up');
  };

  // timeline states
  const tl =
    tx.status === 'completed'
      ? [
          ['Sent', 'Payment received', 'done'],
          ['Processing', 'Completed', 'done'],
          ['Delivered', 'Delivered', 'done'],
        ]
      : tx.status === 'failed'
        ? [
            ['Sent', 'Payment received', 'done'],
            ['Failed', 'Could not be delivered', 'failed'],
          ]
        : [
            ['Sent', 'Payment received', 'done'],
            ['Processing', 'In progress', 'active'],
            ['Delivered', 'Pending', 'pending'],
          ];

  return (
    <Screen>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 24 }}
      >
        <View className="pt-2 flex-row items-center gap-3">
          <BackButton fallback="/(app)/(tabs)/transactions" />
          <Text className="font-display-bold text-navy-deep" style={{ fontSize: 22 }}>
            Transaction details
          </Text>
        </View>

        {/* Hero */}
        <View className="rounded-card bg-white border border-border/60 mt-4 py-6 items-center">
          <Text className="font-display-bold text-navy-deep" style={{ fontSize: 34 }}>
            {isTopup ? '+' : ''}
            {gbp(tx.amountMinor)}
          </Text>
          <Text className="font-sans text-body text-navy/55 mt-1">
            {isTopup ? 'Added to wallet' : `to ${tx.recipientName || 'recipient'}`}
          </Text>
          <View className="flex-row items-center gap-1.5 mt-2">
            <Ionicons name={st.icon} size={18} color={st.fg} />
            <Text className="font-sans-bold text-body" style={{ color: st.fg }}>
              {st.label}
            </Text>
          </View>
        </View>

        {/* Status timeline */}
        {!isTopup ? (
          <View className="rounded-card bg-white border border-border/60 mt-4 px-5 py-4">
            <Text className="font-sans-bold text-base text-navy-deep mb-3">Status timeline</Text>
            {tl.map(([title, sub, state], i) => {
              const dotColor =
                state === 'done'
                  ? '#2E9E6F'
                  : state === 'active'
                    ? '#F59E0B'
                    : state === 'failed'
                      ? '#DC2626'
                      : '#D1D5DB';
              return (
                <View key={title} className="flex-row">
                  <View className="items-center mr-3">
                    <View
                      className="h-7 w-7 rounded-pill items-center justify-center"
                      style={{ backgroundColor: dotColor }}
                    >
                      <Ionicons
                        name={
                          state === 'failed'
                            ? 'close'
                            : state === 'pending'
                              ? 'ellipse'
                              : 'checkmark'
                        }
                        size={state === 'pending' ? 8 : 15}
                        color="#fff"
                      />
                    </View>
                    {i < tl.length - 1 ? (
                      <View
                        className="w-0.5 flex-1 my-1"
                        style={{
                          backgroundColor: state === 'done' ? '#2E9E6F' : '#E5E7EB',
                          minHeight: 22,
                        }}
                      />
                    ) : null}
                  </View>
                  <View className="pb-4">
                    <Text
                      className="font-sans-bold text-base"
                      style={{ color: state === 'pending' ? '#9CA3AF' : color.navy.deep }}
                    >
                      {title}
                    </Text>
                    <Text className="font-sans text-caption text-navy/45">{sub}</Text>
                  </View>
                </View>
              );
            })}
          </View>
        ) : null}

        {/* Details */}
        <View className="rounded-card bg-white border border-border/60 mt-4 px-5 py-2">
          <Text className="font-sans-bold text-base text-navy-deep py-3">Details</Text>
          <Row label="Date & time" value={when} />
          {tx.method ? (
            <Row
              label="Payment method"
              value={tx.method === 'Debit card' ? 'Debit card •••• 4242' : tx.method}
            />
          ) : null}
          {!isTopup ? <Row label="Delivery method" value={deliveryLabel} last /> : null}
        </View>

        {/* Reference */}
        <View className="rounded-card bg-white border border-border/60 mt-4 px-5 py-3 flex-row justify-between">
          <Text className="font-sans text-body text-navy/55">Reference number</Text>
          <Text className="font-sans-semibold text-body text-navy-deep">{tx.id}</Text>
        </View>

        {/* Payment breakdown (sends) */}
        {!isTopup ? (
          <View className="rounded-card bg-white border border-border/60 mt-4 px-5 py-2">
            <Text className="font-sans-bold text-base text-navy-deep py-3">Payment breakdown</Text>
            <Row label="Amount sent" value={gbp(tx.amountMinor)} />
            <Row label="Fee" value="Free" valueColor={color.success.wallet} />
            {corridor ? (
              <Row
                label="Exchange rate"
                value={`1 GBP = ${corridor.rate.toLocaleString('en-GB', { minimumFractionDigits: 2 })} ${corridor.currency}`}
              />
            ) : null}
            <View className="flex-row justify-between py-3 border-t border-border-divider">
              <Text className="font-sans-bold text-body text-navy-deep">Total paid</Text>
              <Text className="font-sans-bold text-body text-navy-deep">{gbp(tx.amountMinor)}</Text>
            </View>
          </View>
        ) : null}

        {/* Recipient (sends) */}
        {!isTopup ? (
          <View className="rounded-card bg-white border border-border/60 mt-4 px-5 py-2">
            <Text className="font-sans-bold text-base text-navy-deep py-3">Recipient</Text>
            <Row label="Name" value={tx.recipientName ?? '—'} />
            <Row label="Destination" value={tx.corridorCountry ?? '—'} />
            <Row label="Delivery channel" value={deliveryLabel} last />
          </View>
        ) : null}

        {/* Share */}
        <Text className="font-sans-semibold text-label text-navy-deep mt-6 mb-2">
          Share receipt
        </Text>
        <View className="flex-row gap-3">
          <ShareBtn
            icon="share-outline"
            label="Share / PDF"
            onPress={() => void shareReceipt(tx)}
          />
          <ShareBtn icon="logo-whatsapp" label="WhatsApp" onPress={() => shareWhatsApp(tx)} />
          <ShareBtn icon="chatbubble-outline" label="Message" onPress={() => shareMessage(tx)} />
        </View>

        <View className="mt-5">
          <Button
            label={isTopup ? 'Add money again' : 'Send again'}
            onPress={isTopup ? addAgain : sendAgain}
          />
        </View>
        <Pressable className="items-center py-4">
          <Text className="font-sans-semibold text-body text-navy/55">Need help?</Text>
        </Pressable>
      </ScrollView>
    </Screen>
  );
}

function Row({
  label,
  value,
  valueColor,
  last,
}: {
  label: string;
  value: string;
  valueColor?: string;
  last?: boolean;
}) {
  return (
    <View
      className={`flex-row justify-between py-3 ${last ? '' : 'border-b border-border-divider'}`}
    >
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
function ShareBtn({
  icon,
  label,
  onPress,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      className="flex-1 rounded-card bg-white border border-border/60 items-center py-4 gap-1.5"
    >
      <Ionicons name={icon} size={22} color={color.coral.DEFAULT} />
      <Text className="font-sans-medium text-caption text-navy/70">{label}</Text>
    </Pressable>
  );
}

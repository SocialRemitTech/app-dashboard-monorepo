// apps/mobile/src/features/send-money/screens/AmountScreen.tsx
import { View, Text, Pressable, TextInput, ScrollView } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Screen } from '@/shared/ui/Screen';
import { BackButton } from '@/shared/ui/BackButton';
import { Button } from '@/shared/ui/Button';
import { Flag } from '@/shared/ui/Flag';
import { color } from '@sr/design-tokens';
import { formatMoney } from '@/shared/ui/money';
import { SEND_FLAG, popularAmountsMinor } from '@/features/send-money/data/corridors';
import { useSend } from '@/features/send-money/stores/send.store';

const PAYOUT_LABEL: Record<string, string> = {
  mobile_money: 'Mobile Money',
  bank: 'Bank Transfer',
};

export function AmountScreen() {
  const { corridor, sendAmountMinor, setAmountMinor, receive } = useSend();
  const major = sendAmountMinor / 100;

  return (
    <Screen>
      <ScrollView
        showsVerticalScrollIndicator={false}
        className="flex-1"
        keyboardShouldPersistTaps="handled"
      >
        <View className="pt-2 flex-row items-center justify-between">
          <BackButton fallback="/(app)/send/destination" />
          <Text className="font-sans text-body text-navy/55">Need help?</Text>
        </View>

        <Text
          className="font-display-bold text-navy-deep mt-3"
          style={{ fontSize: 30, lineHeight: 34 }}
        >
          How much would you like to send?
        </Text>
        <Text className="font-sans text-body text-navy/55 mt-1">
          See the exchange rate, fee and final amount before you send.
        </Text>

        <Text className="font-sans text-label text-navy/55 mt-6 mb-2">You send</Text>
        <View
          className="h-16 rounded-card bg-white px-4 flex-row items-center"
          style={{ borderWidth: 2, borderColor: color.coral.light }}
        >
          <Flag code={SEND_FLAG} size={30} />
          <Text className="font-sans-semibold text-base text-navy/70 ml-2">GBP</Text>
          <Ionicons name="chevron-down" size={16} color={color.grey.mid} />
          <TextInput
            value={String(major)}
            onChangeText={(t) => setAmountMinor(Number(t.replace(/[^\d]/g, '') || 0) * 100)}
            keyboardType="number-pad"
            className="flex-1 text-right font-display-bold text-navy"
            style={{ fontSize: 28 }}
          />
        </View>

        <Text className="font-sans-medium text-caption text-navy/50 mt-4 mb-2">
          Popular amounts
        </Text>
        <View className="flex-row gap-3">
          {popularAmountsMinor.map((m) => {
            const active = m === sendAmountMinor;
            return (
              <Pressable
                key={m}
                onPress={() => setAmountMinor(m)}
                className="flex-1 h-11 rounded-input items-center justify-center"
                style={{ backgroundColor: active ? color.coral.DEFAULT : '#F1F1F1' }}
              >
                <Text
                  className={`font-sans-semibold text-body ${active ? 'text-white' : 'text-navy/70'}`}
                >
                  £{m / 100}
                </Text>
              </Pressable>
            );
          })}
        </View>

        <View className="items-center my-4">
          <Ionicons name="swap-vertical" size={22} color={color.grey.light} />
        </View>

        <Text className="font-sans text-label text-navy/55 mb-2">Recipient receives</Text>
        <View className="h-16 rounded-card bg-white px-4 flex-row items-center border border-border">
          <Flag code={corridor.flag} size={30} />
          <Text className="font-sans-semibold text-base text-navy/70 ml-2">
            {corridor.currency}
          </Text>
          <Text className="flex-1 text-right font-display-bold text-navy" style={{ fontSize: 26 }}>
            {formatMoney(receive())}
          </Text>
        </View>

        <View className="rounded-card bg-cream/80 px-4 py-4 mt-4 gap-2">
          <Row
            label="Rate"
            value={`£1 = ${corridor.rate.toLocaleString('en-GB', { minimumFractionDigits: 2 })} ${corridor.currency}`}
          />
          <Row label="Fee" value="Free" valueClass="text-success-wallet" />
          <Row label="Delivery" value="Within minutes" />
        </View>

        {/* Available payout methods (Image 18) */}
        <View className="rounded-card bg-white border border-border/60 px-4 py-4 mt-4">
          <View className="flex-row items-center gap-2 mb-2">
            <Flag code={corridor.flag} size={22} />
            <Text className="font-sans-bold text-base text-navy-deep">
              Sending to {corridor.country}
            </Text>
          </View>
          <Text className="font-sans text-caption text-navy/50 mb-2">
            Available payout methods:
          </Text>
          {corridor.payoutMethods.map((p) => (
            <View key={p} className="flex-row items-center gap-2 py-0.5">
              <Ionicons name="checkmark" size={16} color={color.success.DEFAULT} />
              <Text className="font-sans text-body text-navy-deep">{PAYOUT_LABEL[p]}</Text>
            </View>
          ))}
          <View className="flex-row items-center gap-2 py-0.5">
            <Ionicons name="flash" size={16} color={color.processing} />
            <Text className="font-sans text-body text-navy/70">
              Most transfers arrive within minutes
            </Text>
          </View>
        </View>

        <View className="h-6" />
      </ScrollView>
      <View className="pb-4">
        <Button
          label="Continue"
          onPress={() => router.push('/(app)/send/delivery')}
          disabled={sendAmountMinor <= 0}
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

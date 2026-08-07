// apps/mobile/src/features/send-money/screens/AmountScreen.tsx
import { View, Text, Pressable, TextInput } from 'react-native';
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

export function AmountScreen() {
  const { corridor, sendAmountMinor, setAmountMinor, receive } = useSend();
  const major = sendAmountMinor / 100;

  const onEdit = (t: string) => {
    const digits = t.replace(/[^\d]/g, '');
    setAmountMinor(Number(digits || 0) * 100);
  };

  return (
    <Screen>
      <View className="pt-2 flex-row items-center justify-between">
        <BackButton fallback="/(app)/send/destination" />
        <Pressable>
          <Text className="font-sans text-body text-navy/60">Need help?</Text>
        </Pressable>
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

      {/* You send */}
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
          onChangeText={onEdit}
          keyboardType="number-pad"
          className="flex-1 text-right font-display-bold text-navy"
          style={{ fontSize: 28 }}
        />
      </View>

      {/* Popular amounts */}
      <Text className="font-sans-medium text-caption text-navy/50 mt-4 mb-2">Popular amounts</Text>
      <View className="flex-row gap-3">
        {popularAmountsMinor.map((m) => {
          const active = m === sendAmountMinor;
          return (
            <Pressable
              key={m}
              onPress={() => setAmountMinor(m)}
              className={`flex-1 h-11 rounded-input items-center justify-center ${active ? 'bg-coral' : 'bg-ink-50'}`}
              style={!active ? { backgroundColor: '#F1F1F1' } : undefined}
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

      {/* swap */}
      <View className="items-center my-4">
        <Ionicons name="swap-vertical" size={22} color={color.grey.light} />
      </View>

      {/* Recipient receives */}
      <Text className="font-sans text-label text-navy/55 mb-2">Recipient receives</Text>
      <View className="h-16 rounded-card bg-white px-4 flex-row items-center border border-border">
        <Flag code={corridor.flag} size={30} />
        <Text className="font-sans-semibold text-base text-navy/70 ml-2">{corridor.currency}</Text>
        <Text className="flex-1 text-right font-display-bold text-navy" style={{ fontSize: 26 }}>
          {formatMoney(receive())}
        </Text>
      </View>

      {/* Rate / Fee / Delivery */}
      <View className="rounded-card bg-cream/80 px-4 py-4 mt-4 gap-2">
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
          label="Continue"
          onPress={() => router.push('/(app)/send/recipient')}
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

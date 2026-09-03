// apps/mobile/src/features/activity/screens/TransactionsScreen.tsx
import { useMemo, useState } from 'react';
import { View, Text, ScrollView, Pressable, TextInput } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Screen } from '@/shared/ui/Screen';
import { initials, avatarColor } from '@/shared/ui/initials';
import { useTransactions, type Transaction } from '@/features/activity/stores/transactions.store';
import { gbp } from '@/features/wallet/stores/wallet.store';
import { color } from '@sr/design-tokens';

const FILTERS = ['All', 'Delivered', 'Failed', 'Processing'] as const;
const STATUS = {
  completed: { label: 'Delivered', fg: '#2E9E6F', icon: 'checkmark-circle' as const },
  processing: { label: 'Processing', fg: '#F59E0B', icon: 'time' as const },
  failed: { label: 'Failed', fg: '#DC2626', icon: 'close-circle' as const },
};
const FILTER_MAP: Record<string, string> = {
  Delivered: 'completed',
  Failed: 'failed',
  Processing: 'processing',
};

function groupLabel(iso: string): string {
  const d = new Date(iso);
  const now = new Date();
  const sameDay = d.toDateString() === now.toDateString();
  if (sameDay) return 'TODAY';
  return d
    .toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })
    .toUpperCase();
}
function ago(iso: string): string {
  const diff = Date.now() - +new Date(iso);
  const h = Math.floor(diff / 3.6e6);
  const dd = Math.floor(h / 24);
  if (dd >= 1) return `${dd}d ago`;
  if (h >= 1) return `${h}h ago`;
  return 'Just now';
}

export function TransactionsScreen() {
  const transactions = useTransactions((s) => s.transactions);
  const [filter, setFilter] = useState<(typeof FILTERS)[number]>('All');
  const [q, setQ] = useState('');

  const rows = useMemo(
    () =>
      transactions.filter((t) => {
        if (filter !== 'All' && t.status !== FILTER_MAP[filter]) return false;
        if (
          q &&
          !(t.recipientName ?? '').toLowerCase().includes(q.toLowerCase()) &&
          !t.id.toLowerCase().includes(q.toLowerCase())
        )
          return false;
        return true;
      }),
    [transactions, filter, q],
  );

  const groups = useMemo(() => {
    const m = new Map<string, Transaction[]>();
    rows.forEach((t) => {
      const k = groupLabel(t.createdAt);
      (m.get(k) ?? m.set(k, []).get(k)!).push(t);
    });
    return Array.from(m.entries());
  }, [rows]);

  return (
    <Screen>
      <Text className="font-display-bold text-navy-deep pt-2" style={{ fontSize: 30 }}>
        Transactions
      </Text>
      <Text className="font-sans text-body text-navy/50 mt-0.5">
        Your complete transfer history
      </Text>

      <View className="mt-4 h-12 rounded-input bg-white border border-border flex-row items-center px-4 gap-2">
        <Ionicons name="search" size={18} color={color.grey.light} />
        <TextInput
          value={q}
          onChangeText={setQ}
          placeholder="Search by name or reference"
          placeholderTextColor={color.grey.light}
          className="flex-1 font-sans text-base text-navy"
        />
      </View>

      <View className="flex-row gap-2 mt-4">
        {FILTERS.map((f) => {
          const on = filter === f;
          return (
            <Pressable
              key={f}
              onPress={() => setFilter(f)}
              className="px-4 py-2 rounded-pill"
              style={{ backgroundColor: on ? color.coral.DEFAULT : '#F1ECE4' }}
            >
              <Text
                className="font-sans-semibold text-caption"
                style={{ color: on ? '#fff' : color.navy.deep }}
              >
                {f}
              </Text>
            </Pressable>
          );
        })}
      </View>

      {rows.length === 0 ? (
        <View className="flex-1 items-center justify-center gap-2">
          <Ionicons name="receipt-outline" size={34} color={color.grey.light} />
          <Text className="font-sans-semibold text-body text-navy/60">No transactions</Text>
        </View>
      ) : (
        <ScrollView
          showsVerticalScrollIndicator={false}
          className="flex-1 mt-4"
          contentContainerStyle={{ paddingBottom: 110 }}
        >
          {groups.map(([label, items]) => (
            <View key={label} className="mb-2">
              <Text className="font-sans-semibold text-caption tracking-wider text-navy/40 mb-1 mt-2">
                {label}
              </Text>
              {items.map((t) => (
                <Row key={t.id} t={t} />
              ))}
            </View>
          ))}
        </ScrollView>
      )}
    </Screen>
  );
}

function Row({ t }: { t: Transaction }) {
  const isTopup = t.type === 'topup';
  const st = STATUS[t.status];
  return (
    <Pressable
      onPress={() => router.push(`/(app)/activity/${t.id}` as never)}
      className="flex-row items-center bg-white rounded-card border border-border/50 px-3 py-3 mb-2"
    >
      {isTopup ? (
        <View
          className="h-10 w-10 rounded-pill items-center justify-center mr-3"
          style={{ backgroundColor: '#DCFCE7' }}
        >
          <Ionicons name="add" size={20} color={color.success.wallet} />
        </View>
      ) : (
        <View
          className="h-10 w-10 rounded-pill items-center justify-center mr-3"
          style={{ backgroundColor: avatarColor(t.recipientName) }}
        >
          <Text className="font-sans-bold text-white" style={{ fontSize: 12 }}>
            {initials(t.recipientName)}
          </Text>
        </View>
      )}
      <View className="flex-1">
        <Text className="font-sans-bold text-base text-navy-deep">
          {isTopup ? 'Wallet top-up' : t.recipientName || 'Recipient'}
        </Text>
        <Text className="font-sans text-caption text-navy/45">{ago(t.createdAt)}</Text>
      </View>
      <View className="items-end mr-1">
        <Text className="font-sans-bold text-base text-navy-deep">
          {isTopup ? '+' : ''}
          {gbp(t.amountMinor)}
        </Text>
        <View className="flex-row items-center gap-1">
          <Ionicons name={st.icon} size={12} color={st.fg} />
          <Text className="font-sans-semibold" style={{ fontSize: 11, color: st.fg }}>
            {st.label}
          </Text>
        </View>
      </View>
      <Ionicons name="chevron-forward" size={16} color={color.grey.light} />
    </Pressable>
  );
}

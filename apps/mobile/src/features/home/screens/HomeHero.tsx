// apps/mobile/src/features/home/screens/HomeHero.tsx
import { useEffect, useState } from 'react';
import { View, Text, Pressable, ScrollView } from 'react-native';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { EmailPromptSheet } from '@/features/home/components/EmailPromptSheet';
import { initials, avatarColor } from '@/shared/ui/initials';
import { useProfile } from '@/features/profile/stores/profile.store';
import { usePreferences } from '@/features/profile/stores/preferences.store';
import { useWallet, gbp } from '@/features/wallet/stores/wallet.store';
import { useTransactions, type Transaction } from '@/features/activity/stores/transactions.store';
import { color } from '@sr/design-tokens';

const ACTIONS: { icon: keyof typeof Ionicons.glyphMap; label: string; href: string }[] = [
  { icon: 'arrow-up', label: 'Send', href: '/(app)/send/destination' },
  { icon: 'add', label: 'Add money', href: '/(app)/wallet/top-up' },
  { icon: 'time-outline', label: 'Activity', href: '/(app)/(tabs)/transactions' },
  { icon: 'gift-outline', label: 'Rewards', href: '/(app)/(tabs)/rewards' },
];

export function HomeHero() {
  const { preferredName, greeting } = useProfile();
  const balanceMinor = useWallet((s) => s.balanceMinor);
  const transactions = useTransactions((s) => s.transactions);
  const email = usePreferences((s) => s.email);
  const dismissed = usePreferences((s) => s.emailPromptDismissed);
  const [emailOpen, setEmailOpen] = useState(false);
  useEffect(() => {
    if (!email && !dismissed) setEmailOpen(true);
  }, [email, dismissed]);

  const hello = greeting && preferredName ? `${greeting}, ${preferredName}` : 'Welcome back';
  const recent = transactions.slice(0, 5);

  return (
    <View className="flex-1 bg-cream">
      <SafeAreaView edges={['top']} className="flex-1">
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 110 }}
        >
          <View className="flex-row items-center justify-between pt-2">
            <View>
              <Text className="font-sans text-caption text-navy/50">{hello}</Text>
              <Text className="font-display-bold text-navy-deep" style={{ fontSize: 20 }}>
                Social Remit
              </Text>
            </View>
            <Pressable
              onPress={() => router.push('/(app)/(tabs)/profile')}
              className="h-10 w-10 rounded-pill bg-white border border-border/60 items-center justify-center"
            >
              <Ionicons name="notifications-outline" size={20} color={color.navy.DEFAULT} />
            </Pressable>
          </View>

          <LinearGradient
            colors={['#FF5A2A', '#E8481B']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={{ borderRadius: 24, padding: 20, marginTop: 16 }}
          >
            <Text
              className="font-sans-medium text-white/70"
              style={{ fontSize: 12, letterSpacing: 1 }}
            >
              WALLET BALANCE
            </Text>
            <Text className="font-display-bold text-white mt-1" style={{ fontSize: 38 }}>
              {gbp(balanceMinor)}
            </Text>
            <View className="flex-row justify-between mt-6">
              {ACTIONS.map((a) => (
                <Pressable
                  key={a.label}
                  onPress={() => router.push(a.href as never)}
                  className="items-center gap-2"
                  style={{ flex: 1 }}
                >
                  <View
                    className="h-12 w-12 rounded-pill items-center justify-center"
                    style={{ backgroundColor: 'rgba(255,255,255,0.18)' }}
                  >
                    <Ionicons name={a.icon} size={22} color={color.white} />
                  </View>
                  <Text className="font-sans-medium text-white/90" style={{ fontSize: 11 }}>
                    {a.label}
                  </Text>
                </Pressable>
              ))}
            </View>
          </LinearGradient>

          <View className="flex-row items-center justify-between mt-7 mb-1">
            <Text className="font-sans-bold text-base text-navy-deep">Recent activity</Text>
            {recent.length > 0 ? (
              <Pressable onPress={() => router.push('/(app)/(tabs)/transactions')}>
                <Text className="font-sans-semibold text-caption text-coral">See all</Text>
              </Pressable>
            ) : null}
          </View>

          {recent.length === 0 ? (
            <View className="rounded-card bg-white border border-border/60 items-center py-10 gap-2 mt-1">
              <Ionicons name="receipt-outline" size={28} color={color.grey.light} />
              <Text className="font-sans text-body text-navy/45">No activity yet</Text>
            </View>
          ) : (
            <View className="rounded-card bg-white border border-border/60 px-4 mt-1">
              {recent.map((t, i) => (
                <Row key={t.id} t={t} first={i === 0} />
              ))}
            </View>
          )}
        </ScrollView>
      </SafeAreaView>
      <EmailPromptSheet visible={emailOpen} onClose={() => setEmailOpen(false)} />
    </View>
  );
}

function Row({ t, first }: { t: Transaction; first: boolean }) {
  const isTopup = t.type === 'topup';
  const date = new Date(t.createdAt).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
  });
  const sub = isTopup ? `Added via ${t.method ?? 'wallet'}` : `Sent to ${t.corridorCountry ?? ''}`;
  return (
    <Pressable
      onPress={() => router.push(`/(app)/activity/${t.id}` as never)}
      className={`flex-row items-center py-3.5 ${first ? '' : 'border-t border-border-divider'}`}
    >
      {isTopup ? (
        <View
          className="h-11 w-11 rounded-pill items-center justify-center mr-3"
          style={{ backgroundColor: '#DCFCE7' }}
        >
          <Ionicons name="add" size={22} color={color.success.wallet} />
        </View>
      ) : (
        <View
          className="h-11 w-11 rounded-pill items-center justify-center mr-3"
          style={{ backgroundColor: avatarColor(t.recipientName) }}
        >
          <Text className="font-sans-bold text-caption text-white">
            {initials(t.recipientName)}
          </Text>
        </View>
      )}
      <View className="flex-1">
        <Text className="font-sans-bold text-base text-navy-deep">
          {isTopup ? 'Wallet top-up' : t.recipientName || 'Recipient'}
        </Text>
        <Text className="font-sans text-caption text-navy/45">
          {sub} · {date}
        </Text>
      </View>
      <Text
        className="font-sans-bold text-base"
        style={{ color: isTopup ? color.success.wallet : '#E5533D' }}
      >
        {isTopup ? '+' : '−'}
        {gbp(t.amountMinor)}
      </Text>
    </Pressable>
  );
}

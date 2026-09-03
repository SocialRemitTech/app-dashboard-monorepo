// apps/mobile/src/features/home/screens/HomeClassic.tsx
import { useEffect, useState } from 'react';
import { View, Text, Pressable, ScrollView, ImageBackground } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Screen } from '@/shared/ui/Screen';
import { EmailPromptSheet } from '@/features/home/components/EmailPromptSheet';
import { initials, avatarColor } from '@/shared/ui/initials';
import { usePreferences } from '@/features/profile/stores/preferences.store';
import { useProfile } from '@/features/profile/stores/profile.store';
import { gbp } from '@/features/wallet/stores/wallet.store';
import { useTransactions, type Transaction } from '@/features/activity/stores/transactions.store';
import { images } from '@/shared/assets';
import { color } from '@sr/design-tokens';

const STATUS = {
  completed: { label: 'Delivered', fg: '#2E9B63', icon: 'checkmark-circle' as const },
  processing: { label: 'Processing', fg: '#F59E0B', icon: 'time' as const },
  failed: { label: 'Failed', fg: '#D64545', icon: 'close-circle' as const },
};

function ago(iso: string) {
  const h = Math.floor((Date.now() - +new Date(iso)) / 3.6e6);
  const d = Math.floor(h / 24);
  return d >= 1 ? `${d}d ago` : h >= 1 ? `${h}h ago` : 'Just now';
}

/**
 * PRIMARY Home. Promo IMAGE CARD at the top (assets/promo-zerofees.jpg behind a navy
 * left-to-right gradient so the white copy stays legible over any photo), then quick
 * actions, welcome offer, setup nudge, and recent activity with initials avatars.
 */
export function HomeClassic() {
  const transactions = useTransactions((s) => s.transactions);
  const { preferredName, greeting } = useProfile();
  const email = usePreferences((s) => s.email);
  const dismissed = usePreferences((s) => s.emailPromptDismissed);
  const [emailOpen, setEmailOpen] = useState(false);
  const [setupShown, setSetupShown] = useState(true);

  useEffect(() => {
    if (!email && !dismissed) setEmailOpen(true);
  }, [email, dismissed]);

  const hello = greeting && preferredName ? `${greeting}, ${preferredName}` : 'Welcome';
  const recent = transactions.slice(0, 4);

  return (
    <Screen>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 110 }}
      >
        {/* Header */}
        <View className="flex-row items-center justify-between pt-2">
          <View className="flex-row items-center gap-3">
            {/* Avatar is the entry point to the whole account journey */}
            <Pressable
              onPress={() => router.push('/(app)/account' as never)}
              accessibilityRole="button"
              accessibilityLabel="Your profile"
              className="h-11 w-11 rounded-pill items-center justify-center"
              style={{ backgroundColor: color.navy.deep }}
            >
              <Ionicons name="person" size={20} color="white" />
            </Pressable>
            <View>
              <Text className="font-display-bold text-navy-deep" style={{ fontSize: 19 }}>
                {hello}
              </Text>
              <Text className="font-sans text-navy/50" style={{ fontSize: 13 }}>
                How can we help you today?
              </Text>
            </View>
          </View>
          <Pressable
            onPress={() => router.push('/(app)/support')}
            className="h-11 w-11 rounded-pill bg-white border border-border/60 items-center justify-center"
          >
            <Ionicons name="notifications-outline" size={20} color={color.navy.deep} />
            <View
              style={{
                position: 'absolute',
                top: 9,
                right: 10,
                width: 7,
                height: 7,
                borderRadius: 4,
                backgroundColor: color.coral.DEFAULT,
              }}
            />
          </Pressable>
        </View>

        {/* ---- PROMO IMAGE CARD ---- */}
        <Pressable
          onPress={() => router.push('/(app)/send/destination')}
          className="mt-5 rounded-card overflow-hidden"
        >
          <ImageBackground
            source={images.promoZeroFees}
            resizeMode="cover"
            style={{ minHeight: 168 }}
          >
            <LinearGradient
              colors={['#12233B', 'rgba(18,35,59,0.86)', 'rgba(18,35,59,0.10)']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              locations={[0, 0.5, 1]}
              style={{ padding: 18, minHeight: 168, justifyContent: 'center' }}
            >
              <Text
                className="font-sans-bold"
                style={{ fontSize: 11, letterSpacing: 1.1, color: '#FF7A4D' }}
              >
                LIMITED-TIME OFFER
              </Text>
              <Text
                className="font-display-bold text-white mt-1.5"
                style={{ fontSize: 23, lineHeight: 29 }}
              >
                Zero fees to{'\n'}Ghana & Nigeria
              </Text>
              <View
                className="rounded-pill mt-3.5 self-start px-6 py-3"
                style={{ backgroundColor: color.coral.DEFAULT }}
              >
                <Text className="font-sans-bold text-white" style={{ fontSize: 15 }}>
                  Send now
                </Text>
              </View>
            </LinearGradient>
          </ImageBackground>
        </Pressable>

        {/* Quick actions — icon card, label underneath */}
        <View className="flex-row justify-between mt-6">
          <Quick
            icon="paper-plane-outline"
            label="Send Money"
            onPress={() => router.push('/(app)/send/destination')}
          />
          <Quick
            icon="trending-up-outline"
            label="Check Rates"
            onPress={() => router.push('/(app)/send/destination')}
          />
          <Quick icon="phone-portrait-outline" label="Airtime & Data" onPress={() => {}} />
        </View>

        {/* Welcome offer */}
        <Pressable className="mt-6 rounded-card bg-white border border-border/60 px-4 py-4 flex-row items-center gap-3">
          <View
            className="h-11 w-11 rounded-input items-center justify-center"
            style={{ backgroundColor: 'rgba(255,90,42,0.08)' }}
          >
            <Ionicons name="gift-outline" size={22} color={color.coral.DEFAULT} />
          </View>
          <View className="flex-1 items-center">
            <Text
              className="font-sans-semibold tracking-wider text-navy/40"
              style={{ fontSize: 10.5 }}
            >
              WELCOME OFFER
            </Text>
            <Text className="font-sans-bold text-navy-deep mt-0.5" style={{ fontSize: 16 }}>
              £10 off your first transfer
            </Text>
          </View>
          <Ionicons name="chevron-forward" size={18} color={color.grey.light} />
        </Pressable>

        {/* Finish setting up */}
        {setupShown ? (
          <View className="mt-4 rounded-card bg-white border border-border/60 px-4 py-4 flex-row items-start">
            <View className="flex-1">
              <Text className="font-sans-bold text-navy-deep" style={{ fontSize: 16 }}>
                Finish setting up your account
              </Text>
              <Pressable
                onPress={() => router.push('/(app)/kyc')}
                className="flex-row items-center gap-1 mt-1"
              >
                <Text className="font-sans-semibold text-coral" style={{ fontSize: 15 }}>
                  Complete setup
                </Text>
                <Ionicons name="arrow-forward" size={14} color={color.coral.DEFAULT} />
              </Pressable>
            </View>
            <Pressable
              onPress={() => setSetupShown(false)}
              className="h-7 w-7 rounded-pill items-center justify-center"
              style={{ backgroundColor: '#F1F0EE' }}
            >
              <Ionicons name="close" size={15} color={color.navy.deep} />
            </Pressable>
          </View>
        ) : null}

        {/* Recent activity */}
        <View className="mt-5 rounded-card bg-white border border-border/60 px-4 pt-4 pb-1">
          <View className="flex-row items-center justify-between mb-1">
            <Text className="font-sans-bold text-navy-deep" style={{ fontSize: 17 }}>
              Recent activity
            </Text>
            <Pressable onPress={() => router.push('/(app)/(tabs)/transactions')}>
              <Text className="font-sans text-navy/55" style={{ fontSize: 14 }}>
                See all
              </Text>
            </Pressable>
          </View>
          {recent.length === 0 ? (
            <View className="items-center py-8 gap-2">
              <Ionicons name="receipt-outline" size={26} color={color.grey.light} />
              <Text className="font-sans text-body text-navy/45">No transfers yet</Text>
            </View>
          ) : (
            recent.map((t) => <ActivityRow key={t.id} t={t} />)
          )}
        </View>
      </ScrollView>

      <EmailPromptSheet visible={emailOpen} onClose={() => setEmailOpen(false)} />
    </Screen>
  );
}

function Quick({
  icon,
  label,
  onPress,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  onPress: () => void;
}) {
  return (
    <Pressable onPress={onPress} className="items-center gap-2" style={{ flex: 1 }}>
      <View
        className="rounded-card bg-white border border-border/60 items-center justify-center"
        style={{ width: 92, height: 82 }}
      >
        <Ionicons name={icon} size={26} color={color.navy.deep} />
      </View>
      <Text className="font-sans text-navy-deep" style={{ fontSize: 13 }}>
        {label}
      </Text>
    </Pressable>
  );
}

function ActivityRow({ t }: { t: Transaction }) {
  const isTopup = t.type === 'topup';
  const st = STATUS[t.status];
  return (
    <Pressable
      onPress={() => router.push(`/(app)/activity/${t.id}` as never)}
      className="flex-row items-center py-3.5 border-t border-border-divider"
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
        <Text className="font-sans-bold text-navy-deep" style={{ fontSize: 16 }}>
          {isTopup ? 'Wallet top-up' : t.recipientName || 'Recipient'}
        </Text>
        <Text className="font-sans text-navy/45" style={{ fontSize: 13 }}>
          {ago(t.createdAt)}
        </Text>
      </View>
      <View className="items-end">
        <Text className="font-sans-bold text-navy-deep" style={{ fontSize: 16 }}>
          {gbp(t.amountMinor)}
        </Text>
        <View className="flex-row items-center gap-1 mt-0.5">
          <Ionicons name={st.icon} size={12} color={st.fg} />
          <Text className="font-sans" style={{ fontSize: 12.5, color: st.fg }}>
            {st.label}
          </Text>
        </View>
      </View>
    </Pressable>
  );
}

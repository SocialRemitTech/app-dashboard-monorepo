// apps/mobile/src/features/profile/screens/ProfileScreen.tsx
import { useState } from 'react';
import { View, Text, Pressable, ScrollView, Share } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Screen } from '@/shared/ui/Screen';
import { AccountStateSheet } from '@/features/profile/components/AccountStateSheet';
import { useAccountState } from '@/features/profile/stores/accountState.store';
import { useSession } from '@/features/auth/stores/session.store';
import { color } from '@sr/design-tokens';

type Row = {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  href?: string;
  /** Opens the prototype state picker instead of navigating straight through. */
  picksState?: boolean;
};

const ROWS: Row[] = [
  { icon: 'person-outline', label: 'Personal details', picksState: true },
  { icon: 'settings-outline', label: 'Security & settings', href: '/(app)/settings' },
  { icon: 'people-outline', label: 'Manage recipients' },
  { icon: 'gift-outline', label: 'Rewards & referrals', href: '/(app)/(tabs)/rewards' },
  { icon: 'help-circle-outline', label: 'Support', href: '/(app)/support' },
  { icon: 'information-circle-outline', label: 'Legal information', href: '/(app)/legal' },
];

/** Entry point for the account journey — opened from the avatar on Home. */
export function ProfileScreen() {
  const socialRemitId = useAccountState((s) => s.socialRemitId);
  const signOut = useSession((s) => s.signOut);
  const [sheet, setSheet] = useState(false);

  const copyId = async () => {
    try {
      await Share.share({ message: socialRemitId });
    } catch {
      /* dismissed */
    }
  };

  const openRow = (r: Row) => {
    if (r.picksState) {
      setSheet(true);
      return;
    }
    if (r.href) router.push(r.href as never);
  };

  return (
    <Screen>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 110 }}
      >
        <View className="pt-2">
          <Pressable
            onPress={() => router.back()}
            className="h-11 w-11 rounded-pill bg-white border border-border/60 items-center justify-center"
          >
            <Ionicons name="arrow-back" size={20} color={color.navy.deep} />
          </Pressable>
        </View>

        <View className="items-center mt-4">
          <View
            className="h-20 w-20 rounded-pill items-center justify-center"
            style={{ backgroundColor: 'rgba(11,37,89,0.06)' }}
          >
            <Ionicons name="person" size={38} color={color.navy.deep} />
          </View>
          <Text className="font-display-bold text-navy-deep mt-4" style={{ fontSize: 26 }}>
            Your profile
          </Text>
          <Text
            className="font-sans-semibold tracking-wider text-navy/40 mt-3"
            style={{ fontSize: 11 }}
          >
            SOCIAL REMIT ID
          </Text>
          <Pressable onPress={copyId} className="flex-row items-center gap-2 mt-1">
            <Text className="font-sans-bold text-navy-deep" style={{ fontSize: 17 }}>
              {socialRemitId}
            </Text>
            <Ionicons name="copy-outline" size={16} color={color.grey.mid} />
          </Pressable>
        </View>

        <View className="mt-8">
          {ROWS.map((r, i) => (
            <Pressable
              key={r.label}
              onPress={() => openRow(r)}
              className={`flex-row items-center py-4 ${i === 0 ? '' : 'border-t border-border-divider'}`}
            >
              <View
                className="h-11 w-11 rounded-pill items-center justify-center mr-3"
                style={{ backgroundColor: '#F2F0EC' }}
              >
                <Ionicons name={r.icon} size={21} color={color.navy.deep} />
              </View>
              <Text className="flex-1 font-sans-bold text-navy-deep" style={{ fontSize: 17 }}>
                {r.label}
              </Text>
              <Ionicons name="chevron-forward" size={18} color={color.grey.light} />
            </Pressable>
          ))}
        </View>

        <Pressable
          onPress={() => void signOut()}
          className="flex-row items-center py-4 mt-2 border-t border-border-divider"
        >
          <View
            className="h-11 w-11 rounded-pill items-center justify-center mr-3"
            style={{ backgroundColor: 'rgba(255,90,42,0.08)' }}
          >
            <Ionicons name="log-out-outline" size={21} color={color.coral.DEFAULT} />
          </View>
          <Text
            className="flex-1 font-sans-bold"
            style={{ fontSize: 17, color: color.coral.DEFAULT }}
          >
            Sign out
          </Text>
        </Pressable>
      </ScrollView>

      {/* Choosing a state applies it, then opens Personal details in that state. */}
      <AccountStateSheet
        visible={sheet}
        onClose={() => setSheet(false)}
        onSelect={() => router.push('/(app)/account/personal-details' as never)}
      />
    </Screen>
  );
}

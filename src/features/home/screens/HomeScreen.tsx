// apps/mobile/src/features/home/screens/HomeScreen.tsx
import { useState } from 'react';
import { View, Text, Pressable, ScrollView } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Screen } from '@/shared/ui/Screen';
import { WalletCard } from '@/shared/ui/WalletCard';
import { EmailPromptSheet } from '@/features/home/components/EmailPromptSheet';
import { useProfile } from '@/features/profile/stores/profile.store';
import { color } from '@sr/design-tokens';

export function HomeScreen() {
  const { preferredName, greeting } = useProfile();
  const [emailSheet, setEmailSheet] = useState(true); // prompt on first load
  const hello = greeting && preferredName ? `${greeting}, ${preferredName}` : 'Welcome back';

  return (
    <Screen>
      <ScrollView showsVerticalScrollIndicator={false} className="flex-1">
        {/* Header */}
        <View className="flex-row items-start justify-between pt-2">
          <View>
            <Text className="font-display-bold text-navy-deep" style={{ fontSize: 24 }}>
              {hello}
            </Text>
            <Text className="font-sans text-body text-navy/50 mt-0.5">How can we help today?</Text>
          </View>
          <View className="flex-row gap-2">
            <IconBtn icon="notifications-outline" />
            <IconBtn icon="menu" onPress={() => router.push('/(app)/(tabs)/profile')} />
          </View>
        </View>

        {/* Wallet card */}
        <View className="mt-5">
          <WalletCard onAddMoney={() => {}} />
        </View>

        {/* Quick actions */}
        <View className="flex-row gap-3 mt-5">
          <Action icon="send" label="Send" onPress={() => router.push('/(app)/send/destination')} />
          <Action icon="phone-portrait-outline" label="Airtime" />
          <Action
            icon="time-outline"
            label="Activity"
            onPress={() => router.push('/(app)/(tabs)/transactions')}
          />
          <Action
            icon="gift-outline"
            label="Rewards"
            onPress={() => router.push('/(app)/(tabs)/rewards')}
          />
        </View>

        {/* Recent activity (empty state) */}
        <Text className="font-sans-bold text-label text-navy-deep mt-8 mb-2">Recent activity</Text>
        <View className="rounded-card bg-white border border-border/60 items-center py-10 gap-2">
          <Ionicons name="receipt-outline" size={28} color={color.grey.light} />
          <Text className="font-sans text-body text-navy/45">No transfers yet</Text>
          <Text className="font-sans text-caption text-navy/40">Your sends will show up here.</Text>
        </View>
      </ScrollView>

      <EmailPromptSheet visible={emailSheet} onClose={() => setEmailSheet(false)} />
    </Screen>
  );
}

function IconBtn({
  icon,
  onPress,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  onPress?: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      className="h-10 w-10 rounded-pill bg-white border border-border/60 items-center justify-center"
    >
      <Ionicons name={icon} size={20} color={color.navy.DEFAULT} />
    </Pressable>
  );
}
function Action({
  icon,
  label,
  onPress,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  onPress?: () => void;
}) {
  return (
    <Pressable onPress={onPress} className="flex-1 items-center gap-2">
      <View className="h-14 w-14 rounded-card bg-coral/10 items-center justify-center">
        <Ionicons name={icon} size={22} color={color.coral.DEFAULT} />
      </View>
      <Text className="font-sans-medium text-caption text-navy/70">{label}</Text>
    </Pressable>
  );
}

// apps/mobile/src/features/rewards/screens/RewardsScreen.tsx
import { View, Text, ScrollView, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Screen } from '@/shared/ui/Screen';
import { color } from '@sr/design-tokens';

export function RewardsScreen() {
  return (
    <Screen>
      <ScrollView showsVerticalScrollIndicator={false} className="flex-1">
        <Text className="font-display-bold text-navy-deep mt-4" style={{ fontSize: 30 }}>
          Rewards
        </Text>
        <Text className="font-sans text-body text-navy/50 mt-0.5">Earn while you send</Text>

        {/* Welcome bonus (coral) */}
        <View className="rounded-card bg-coral p-5 mt-5">
          <View className="flex-row items-center justify-between">
            <View className="flex-row items-center gap-2">
              <View className="h-9 w-9 rounded-pill bg-white/20 items-center justify-center">
                <Ionicons name="gift" size={18} color={color.white} />
              </View>
              <Text className="font-sans-bold text-base text-white">Welcome bonus</Text>
            </View>
            <View className="rounded-pill bg-white/25 px-3 py-1">
              <Text className="font-sans-bold text-caption text-white">ACTIVE</Text>
            </View>
          </View>
          <Text className="font-sans text-body text-white/90 mt-4">
            Get £10 Off Your First Transfer of £50 or More
          </Text>
          <Text className="font-display-bold text-white mt-2" style={{ fontSize: 40 }}>
            £10
          </Text>
        </View>

        <RewardRow
          icon="star-outline"
          title="Refer a friend"
          subtitle="Earn £10 for every friend who sends money"
        />
        <RewardRow
          icon="ribbon-outline"
          title="Loyalty rewards"
          subtitle="Send regularly and unlock exclusive benefits"
        />

        <Text className="font-sans-bold text-caption tracking-widest text-navy/40 mt-8 mb-2">
          HOW IT WORKS
        </Text>
        {[
          'Send £50 or more on your first transfer to get £10 off.',
          'Refer friends and earn £10 each time they send.',
          'Keep sending to climb loyalty tiers and unlock perks.',
        ].map((t, i) => (
          <View key={i} className="flex-row gap-3 mb-3">
            <View className="h-6 w-6 rounded-pill bg-coral/10 items-center justify-center">
              <Text className="font-sans-bold text-caption text-coral">{i + 1}</Text>
            </View>
            <Text className="flex-1 font-sans text-body text-navy/70">{t}</Text>
          </View>
        ))}
      </ScrollView>
    </Screen>
  );
}

function RewardRow({
  icon,
  title,
  subtitle,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  subtitle: string;
}) {
  return (
    <Pressable className="rounded-card bg-white border border-border/60 p-4 mt-3 flex-row items-center">
      <View className="h-10 w-10 rounded-pill bg-coral/10 items-center justify-center mr-3">
        <Ionicons name={icon} size={20} color={color.coral.DEFAULT} />
      </View>
      <View className="flex-1">
        <Text className="font-sans-bold text-base text-navy-deep">{title}</Text>
        <Text className="font-sans text-caption text-navy/50 mt-0.5">{subtitle}</Text>
      </View>
      <Ionicons name="chevron-forward" size={18} color={color.grey.light} />
    </Pressable>
  );
}

// apps/mobile/src/shared/ui/WalletCard.tsx
import { View, Text, Pressable } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { color } from '@sr/design-tokens';

/** The Social Remit wallet/debit card. Balance is passed in (server-owned in production). */
export function WalletCard({
  balanceLabel = '£0.00',
  status = 'Group VIP Member',
  onAddMoney,
}: {
  balanceLabel?: string;
  status?: string;
  onAddMoney?: () => void;
}) {
  return (
    <LinearGradient
      colors={[color.coral.DEFAULT, color.coral.pressed, color.navy.deep]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={{ borderRadius: 24, padding: 20 }}
    >
      <View className="flex-row items-start justify-between">
        <Text className="font-display-bold text-white text-lg">Social Remit</Text>
        <View className="rounded-pill bg-white/20 px-3 py-1">
          <Text className="font-sans-medium text-caption text-white">{status}</Text>
        </View>
      </View>

      <Text className="font-sans text-caption text-white/70 mt-6">Available balance</Text>
      <Text className="font-display-bold text-white" style={{ fontSize: 34 }}>
        {balanceLabel}
      </Text>

      <View className="flex-row items-center justify-between mt-5">
        <Pressable
          onPress={onAddMoney}
          className="flex-row items-center gap-1 rounded-pill bg-white/95 px-4 py-2"
        >
          <Ionicons name="add" size={16} color={color.coral.DEFAULT} />
          <Text className="font-sans-semibold text-caption text-coral">Add money</Text>
        </Pressable>
        <Ionicons
          name="wifi"
          size={22}
          color="rgba(255,255,255,0.85)"
          style={{ transform: [{ rotate: '90deg' }] }}
        />
      </View>
    </LinearGradient>
  );
}

// apps/mobile/app/(app)/(tabs)/transactions.tsx — activity (empty state for now)
import { View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Screen } from '@/shared/ui/Screen';
import { color } from '@sr/design-tokens';
export default function Transactions() {
  return (
    <Screen>
      <Text className="font-display-bold text-navy-deep mt-4" style={{ fontSize: 30 }}>
        Activity
      </Text>
      <View className="flex-1 items-center justify-center gap-2">
        <Ionicons name="receipt-outline" size={30} color={color.grey.light} />
        <Text className="font-sans text-body text-navy/45">No transactions yet</Text>
      </View>
    </Screen>
  );
}

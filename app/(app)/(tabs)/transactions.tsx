// apps/mobile/app/(app)/(tabs)/transactions.tsx — Activity tab
import { View, Text } from 'react-native';
import { Screen } from '@/shared/ui/Screen';

export default function Transactions() {
  return (
    <Screen>
      <View className="flex-1 justify-center">
        <Text className="text-xl font-semibold text-ink-900">Activity</Text>
      </View>
    </Screen>
  );
}

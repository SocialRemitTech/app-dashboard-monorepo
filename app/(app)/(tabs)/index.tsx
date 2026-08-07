// apps/mobile/app/(app)/(tabs)/index.tsx — Home tab
import { View, Text } from 'react-native';
import { router } from 'expo-router';
import { Screen } from '@/shared/ui/Screen';
import { Button } from '@/shared/ui/Button';

export default function Home() {
  return (
    <Screen>
      <View className="flex-1 justify-center gap-1">
        <Text className="text-2xl font-bold text-ink-900">What would you like to do today?</Text>
        <Text className="text-ink-500">Wallet, recent activity and actions render here.</Text>
      </View>
      <View className="pb-6">
        <Button label="Send money" onPress={() => router.push('/(app)/send')} />
      </View>
    </Screen>
  );
}

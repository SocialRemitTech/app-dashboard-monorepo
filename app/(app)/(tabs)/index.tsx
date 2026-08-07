// apps/mobile/app/(app)/(tabs)/index.tsx — Home tab
import { View, Text } from 'react-native';
import { router } from 'expo-router';
import { Screen } from '@/shared/ui/Screen';
import { Button } from '@/shared/ui/Button';

export default function Home() {
  return (
    <Screen>
      <View className="flex-1 justify-center gap-1">
        <Text className="text-2xl font-display-bold text-navy-deep">Welcome back</Text>
        <Text className="font-sans text-body text-navy/55">
          Your wallet card, balance and activity render here (next build).
        </Text>
      </View>
      <View className="pb-6">
        <Button label="Send money" onPress={() => router.push('/(app)/send/destination')} />
      </View>
    </Screen>
  );
}

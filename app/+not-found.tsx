// apps/mobile/app/+not-found.tsx
import { View, Text } from 'react-native';
import { Screen } from '@/shared/ui/Screen';
export default function NotFound() {
  return (
    <Screen>
      <View className="flex-1 items-center justify-center">
        <Text className="text-ink-500">This screen doesn’t exist.</Text>
      </View>
    </Screen>
  );
}

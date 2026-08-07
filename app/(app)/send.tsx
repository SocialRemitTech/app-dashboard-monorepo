// apps/mobile/app/(app)/send.tsx — Send money entry (driven by the send-money state machine)
import { View, Text } from 'react-native';
import { Screen } from '@/shared/ui/Screen';

export default function Send() {
  return (
    <Screen>
      <View className="flex-1 justify-center">
        <Text className="text-xl font-semibold text-ink-900">Send money</Text>
        <Text className="text-ink-500">corridor → amount → recipient → KYC → summary → pay</Text>
      </View>
    </Screen>
  );
}

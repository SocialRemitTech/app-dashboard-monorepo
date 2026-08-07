// apps/mobile/app/(app)/send/recipient.tsx — stub (next build: recipient details + KYC gate)
import { View, Text } from 'react-native';
import { Screen } from '@/shared/ui/Screen';
import { BackButton } from '@/shared/ui/BackButton';
export default function Recipient() {
  return (
    <Screen>
      <View className="pt-2">
        <BackButton fallback="/(app)/send/amount" />
      </View>
      <View className="flex-1 justify-center">
        <Text className="font-display-bold text-navy-deep" style={{ fontSize: 26 }}>
          Recipient
        </Text>
        <Text className="font-sans text-body text-navy/60 mt-2">
          Next: recipient details (config-driven per delivery method) → KYC gate → payment → summary
          → processing.
        </Text>
      </View>
    </Screen>
  );
}

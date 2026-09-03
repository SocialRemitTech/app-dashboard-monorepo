// apps/mobile/src/features/menu/screens/PaymentMethodsScreen.tsx
import { View, Text, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Screen } from '@/shared/ui/Screen';
import { PageHeader } from '@/shared/ui/PageHeader';
import { Button } from '@/shared/ui/Button';
import { color } from '@sr/design-tokens';

export function PaymentMethodsScreen() {
  return (
    <Screen>
      <ScrollView showsVerticalScrollIndicator={false} className="flex-1">
        <PageHeader title="Payment methods" subtitle="How you pay for transfers." />
        <View className="rounded-card bg-white border border-border/60 items-center py-12 gap-2 mt-6">
          <Ionicons name="card-outline" size={30} color={color.grey.light} />
          <Text className="font-sans-semibold text-body text-navy/70">No payment methods yet</Text>
          <Text className="font-sans text-caption text-navy/45 text-center px-8">
            Add a debit card or bank account to pay for your transfers.
          </Text>
        </View>
      </ScrollView>
      <View className="pb-6">
        <Button label="Add payment method" onPress={() => {}} />
      </View>
    </Screen>
  );
}

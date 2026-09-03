// apps/mobile/src/features/kyc/screens/AboutTransferScreen.tsx
import { View, Text, ScrollView, Pressable } from 'react-native';
import { router } from 'expo-router';
import { Screen } from '@/shared/ui/Screen';
import { BackButton } from '@/shared/ui/BackButton';
import { Button } from '@/shared/ui/Button';
import { useKyc } from '@/features/kyc/stores/kyc.store';
import { color } from '@sr/design-tokens';

const RELATIONSHIPS = [
  'Mother',
  'Father',
  'Sister',
  'Brother',
  'Spouse',
  'Child',
  'Friend',
  'Business Partner',
  'Employee',
  'Other Family',
  'Other',
];
const PURPOSES = [
  'Family Support',
  'School Fees',
  'Medical Expenses',
  'Living Expenses',
  'Business Payment',
  'Rent Payment',
];

function Chip({ label, on, onPress }: { label: string; on: boolean; onPress: () => void }) {
  return (
    <Pressable
      onPress={onPress}
      className={`px-4 py-3 rounded-input border ${on ? 'bg-coral/10 border-coral' : 'bg-white border-border/70'}`}
      style={{ minWidth: '47%', flexGrow: 1 }}
    >
      <Text className={`font-sans-medium text-body ${on ? 'text-coral' : 'text-navy-deep'}`}>
        {label}
      </Text>
    </Pressable>
  );
}

export function AboutTransferScreen() {
  const { relationship, purpose, set } = useKyc();
  const valid = relationship && purpose;

  return (
    <Screen>
      <ScrollView showsVerticalScrollIndicator={false} className="flex-1">
        <View className="pt-2 flex-row items-center justify-between">
          <BackButton fallback="/(app)/kyc/about-you" />
          <Text className="font-sans text-body text-navy/55">Need help?</Text>
        </View>

        <Text
          className="font-display-bold text-navy-deep mt-4"
          style={{ fontSize: 28, lineHeight: 34 }}
        >
          Tell us about this transfer
        </Text>
        <Text className="font-sans text-body text-navy/55 mt-1">Relationship and purpose</Text>

        <Text className="font-sans-semibold text-base text-navy-deep mt-6 mb-3">
          What’s your relationship with the recipient?
        </Text>
        <View className="flex-row flex-wrap gap-3">
          {RELATIONSHIPS.map((r) => (
            <Chip
              key={r}
              label={r}
              on={relationship === r}
              onPress={() => set({ relationship: r })}
            />
          ))}
        </View>

        <Text className="font-sans-semibold text-base text-navy-deep mt-7 mb-3">
          What’s the purpose of this transfer?
        </Text>
        <View className="flex-row flex-wrap gap-3">
          {PURPOSES.map((p) => (
            <Chip key={p} label={p} on={purpose === p} onPress={() => set({ purpose: p })} />
          ))}
        </View>

        <View className="h-6" />
      </ScrollView>
      <View className="pb-4">
        <Button
          label="Continue"
          onPress={() => router.push('/(app)/kyc/verifying')}
          disabled={!valid}
        />
      </View>
    </Screen>
  );
}

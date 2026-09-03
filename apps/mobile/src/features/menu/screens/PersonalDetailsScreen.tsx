// apps/mobile/src/features/menu/screens/PersonalDetailsScreen.tsx
import { View, Text, ScrollView } from 'react-native';
import { Screen } from '@/shared/ui/Screen';
import { PageHeader, FieldRow } from '@/shared/ui/PageHeader';
import { TipCard } from '@/shared/ui/TipCard';
import { useProfile } from '@/features/profile/stores/profile.store';

export function PersonalDetailsScreen() {
  const { preferredName, phone } = useProfile();
  return (
    <Screen>
      <ScrollView showsVerticalScrollIndicator={false} className="flex-1">
        <PageHeader title="Personal details" subtitle="The information on your account." />
        <View className="mt-6">
          <FieldRow label="Full name" value={preferredName || 'User'} />
          <FieldRow label="Mobile number" value={phone} />
          <FieldRow label="Email" value="Add email" muted />
          <FieldRow label="Date of birth" value="Not set" muted />
          <FieldRow label="Address" value="Not set" muted />
          <FieldRow label="Nationality" value="Not set" muted />
        </View>
        <View className="mt-6">
          <TipCard>
            Some details are verified during onboarding and can only be changed by contacting
            support.
          </TipCard>
        </View>
      </ScrollView>
    </Screen>
  );
}

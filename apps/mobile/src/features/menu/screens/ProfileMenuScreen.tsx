// apps/mobile/src/features/menu/screens/ProfileMenuScreen.tsx
import { View, Text, ScrollView, Pressable } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Screen } from '@/shared/ui/Screen';
import { ListRow, SectionLabel } from '@/shared/ui/ListRow';
import { useProfile } from '@/features/profile/stores/profile.store';
import { useSession } from '@/features/auth/stores/session.store';
import { color } from '@sr/design-tokens';

export function ProfileMenuScreen() {
  const { preferredName, phone } = useProfile();
  const signOut = useSession((s) => s.signOut);

  return (
    <Screen>
      <ScrollView showsVerticalScrollIndicator={false} className="flex-1">
        <View className="flex-row items-center gap-4 mt-6">
          <View className="h-16 w-16 rounded-pill bg-coral/10 items-center justify-center">
            <Ionicons name="person" size={28} color={color.coral.DEFAULT} />
          </View>
          <View className="flex-1">
            <Text className="font-sans-bold text-lg text-navy-deep">{preferredName || 'User'}</Text>
            <Text className="font-sans text-caption text-navy/50">{phone}</Text>
            <Pressable onPress={() => router.push('/(app)/personal-details')}>
              <Text className="font-sans-semibold text-caption text-coral mt-1">View profile</Text>
            </Pressable>
          </View>
        </View>

        <SectionLabel>ACCOUNT</SectionLabel>
        <ListRow
          icon="person-outline"
          title="Personal details"
          onPress={() => router.push('/(app)/personal-details')}
        />
        <ListRow
          icon="card-outline"
          title="Payment methods"
          onPress={() => router.push('/(app)/payment-methods')}
        />
        <ListRow
          icon="settings-outline"
          title="Settings"
          onPress={() => router.push('/(app)/settings')}
        />

        <SectionLabel>SUPPORT</SectionLabel>
        <ListRow
          icon="help-circle-outline"
          title="Support"
          onPress={() => router.push('/(app)/support')}
        />

        <SectionLabel>ABOUT</SectionLabel>
        <ListRow
          icon="information-circle-outline"
          title="About Social Remit"
          onPress={() => router.push('/(app)/about')}
        />
        <ListRow
          icon="document-text-outline"
          title="Legal information"
          onPress={() => router.push('/(app)/legal')}
        />

        <Pressable onPress={() => void signOut()} className="mt-8 mb-6 items-center">
          <Text className="font-sans-semibold text-body text-error">Log out</Text>
        </Pressable>
      </ScrollView>
    </Screen>
  );
}

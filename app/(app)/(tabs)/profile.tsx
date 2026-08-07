// apps/mobile/app/(app)/(tabs)/profile.tsx — Profile tab
import { View, Text } from 'react-native';
import { Screen } from '@/shared/ui/Screen';
import { Button } from '@/shared/ui/Button';
import { useSession } from '@/features/auth';

export default function Profile() {
  const signOut = useSession((s) => s.signOut);
  return (
    <Screen>
      <View className="flex-1 justify-center">
        <Text className="text-xl font-semibold text-ink-900">Profile</Text>
      </View>
      <View className="pb-6">
        <Button label="Log out" variant="ghost" onPress={() => void signOut()} />
      </View>
    </Screen>
  );
}

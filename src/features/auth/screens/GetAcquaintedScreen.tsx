// apps/mobile/src/features/auth/screens/GetAcquaintedScreen.tsx
import { View, Text } from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Logo } from '@/shared/ui/Logo';
import { Button } from '@/shared/ui/Button';

export function GetAcquaintedScreen() {
  return (
    <SafeAreaView className="flex-1 bg-white" edges={['top', 'bottom']}>
      <View className="flex-1 items-center justify-center">
        <Logo size={96} variant="coral" />
      </View>
      <View className="px-4 pb-6 gap-4">
        <Text className="text-center font-sans text-body text-navy/60 leading-6">
          The financial hub built by{'\n'}the diaspora, for the diaspora.
        </Text>
        <Button label="Get Acquainted" onPress={() => router.push('/(auth)/welcome')} />
      </View>
    </SafeAreaView>
  );
}

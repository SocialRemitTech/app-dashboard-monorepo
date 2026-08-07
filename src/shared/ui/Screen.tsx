// apps/mobile/src/shared/ui/Screen.tsx
import type { ReactNode } from 'react';
import { View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

/** Standard authenticated screen: cream background (spec §3), 16px horizontal padding. */
export function Screen({ children }: { children: ReactNode }) {
  return (
    <SafeAreaView className="flex-1 bg-cream" edges={['top', 'bottom']}>
      <View className="flex-1 px-4">{children}</View>
    </SafeAreaView>
  );
}

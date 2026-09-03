// apps/mobile/src/shared/ui/TipCard.tsx
import { View, Text } from 'react-native';

export function TipCard({ children }: { children: string }) {
  return (
    <View className="rounded-card bg-cream/70 px-4 py-3 border border-border/60">
      <Text className="font-sans text-caption text-navy/60 leading-5">{children}</Text>
    </View>
  );
}

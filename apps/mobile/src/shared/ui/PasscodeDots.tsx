// apps/mobile/src/shared/ui/PasscodeDots.tsx
import { View } from 'react-native';
import { color } from '@sr/design-tokens';

/** Five-dot passcode progress indicator — small dots, generous spacing (per design). */
export function PasscodeDots({
  length = 5,
  filled,
  error,
}: {
  length?: number;
  filled: number;
  error?: boolean;
}) {
  return (
    <View className="flex-row justify-center" style={{ gap: 30 }}>
      {Array.from({ length }).map((_, i) => (
        <View
          key={i}
          style={{
            width: 11,
            height: 11,
            borderRadius: 5.5,
            backgroundColor: error ? '#D64545' : i < filled ? color.navy.deep : '#D5D2CE',
          }}
        />
      ))}
    </View>
  );
}

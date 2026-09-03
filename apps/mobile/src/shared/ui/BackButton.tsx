// apps/mobile/src/shared/ui/BackButton.tsx
import { Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { color } from '@sr/design-tokens';

/**
 * Goes back if there's history; otherwise navigates to `fallback` (default: welcome).
 * Prevents the "back lands on a screen that immediately bounces me forward" problem.
 */
export function BackButton({
  onPress,
  fallback = '/(auth)/welcome',
}: {
  onPress?: () => void;
  fallback?: string;
}) {
  const handle = () => {
    if (onPress) return onPress();
    if (router.canGoBack()) router.back();
    else router.replace(fallback as never);
  };
  return (
    <Pressable
      onPress={handle}
      accessibilityRole="button"
      accessibilityLabel="Go back"
      hitSlop={8}
      className="h-11 w-11 rounded-pill items-center justify-center bg-coral/10"
    >
      <Ionicons name="arrow-back" size={22} color={color.coral.DEFAULT} />
    </Pressable>
  );
}

// apps/mobile/src/shared/ui/Button.tsx
import { Pressable, Text } from 'react-native';
import { shadow } from '@sr/design-tokens';

type Variant = 'primary' | 'outline' | 'ghost';

/** Coral is the ACTION colour only (spec §5) — never restyle this to convey a state. */
export function Button({
  label, onPress, variant = 'primary', disabled,
}: {
  label: string;
  onPress: () => void;
  variant?: Variant;
  disabled?: boolean;
}) {
  const base = 'h-14 rounded-button items-center justify-center';
  const container =
    variant === 'primary'
      ? `${base} ${disabled ? 'bg-navy/10' : 'bg-coral'}`
      : variant === 'outline'
        ? `${base} bg-white border border-border-form`
        : `${base} bg-transparent`;
  const text =
    variant === 'primary'
      ? `font-sans-semibold text-base ${disabled ? 'text-navy/40' : 'text-white'}`
      : variant === 'outline'
        ? 'font-sans-semibold text-base text-navy-deep'
        : 'font-sans-medium text-navy/75';
  return (
    <Pressable
      className={container}
      onPress={onPress}
      disabled={disabled}
      accessibilityRole="button"
      style={variant === 'primary' && !disabled ? shadow.ctaActive : undefined}
    >
      <Text className={text}>{label}</Text>
    </Pressable>
  );
}

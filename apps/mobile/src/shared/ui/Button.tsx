// apps/mobile/src/shared/ui/Button.tsx
import { Pressable, Text } from 'react-native';
import { shadow } from '@sr/design-tokens';

type Variant = 'primary' | 'secondary' | 'outline' | 'ghost';

/**
 * Coral is the ACTION colour only (spec §5) — never restyle this to convey a state.
 * Disabled uses the spec's cool grey #E5E7EB, not a navy wash.
 */
export function Button({
  label,
  onPress,
  variant = 'primary',
  disabled,
}: {
  label: string;
  onPress: () => void;
  variant?: Variant;
  disabled?: boolean;
}) {
  const base = 'h-14 rounded-button items-center justify-center';
  const container =
    variant === 'primary'
      ? `${base} ${disabled ? '' : 'bg-coral'}`
      : variant === 'secondary'
        ? base
        : variant === 'outline'
          ? `${base} bg-white border border-border-form`
          : `${base} bg-transparent`;

  const bg =
    variant === 'primary' && disabled
      ? '#E5E7EB' // spec: disabled / inactive CTA
      : variant === 'secondary'
        ? '#EEEDEB' // neutral secondary fill
        : undefined;

  const text =
    variant === 'primary'
      ? `font-sans-semibold text-base ${disabled ? '' : 'text-white'}`
      : variant === 'secondary'
        ? 'font-sans-bold text-base text-navy-deep'
        : variant === 'outline'
          ? 'font-sans-semibold text-base text-navy-deep'
          : 'font-sans-medium text-navy/75';

  return (
    <Pressable
      className={container}
      onPress={onPress}
      disabled={disabled}
      accessibilityRole="button"
      accessibilityState={{ disabled: !!disabled }}
      style={[
        bg ? { backgroundColor: bg } : undefined,
        variant === 'primary' && !disabled ? shadow.ctaActive : undefined,
      ]}
    >
      <Text
        className={text}
        style={variant === 'primary' && disabled ? { color: '#9CA3AF' } : undefined}
      >
        {label}
      </Text>
    </Pressable>
  );
}

// apps/mobile/src/shared/ui/PinInput.tsx
import { useRef, useState } from 'react';
import { View, Text, Pressable, TextInput } from 'react-native';
import { color } from '@sr/design-tokens';

/**
 * Stable PIN entry: ONE hidden full-width TextInput holds the whole value; the visible
 * cells are pure display. This avoids the focus-juggling / re-render shake that per-cell
 * controlled inputs cause in React Native. Hard-capped at `length`.
 */
export function PinInput({
  length = 5,
  value,
  onChange,
  error,
}: {
  length?: number;
  value: string;
  onChange: (v: string) => void;
  error?: boolean;
}) {
  const ref = useRef<TextInput>(null);
  const [focused, setFocused] = useState(true);
  const [show, setShow] = useState(false);
  const chars = value.split('');

  const handle = (raw: string) => onChange(raw.replace(/\D/g, '').slice(0, length));

  return (
    <View className="items-center gap-4">
      <Pressable onPress={() => ref.current?.focus()}>
        <View className="flex-row gap-3">
          {Array.from({ length }).map((_, i) => {
            const filled = i < chars.length;
            const isCursor = focused && i === chars.length;
            const borderColor = error
              ? color.error
              : isCursor
                ? color.coral.softer
                : filled
                  ? '#D1D5DB'
                  : color.border.DEFAULT;
            return (
              <View
                key={i}
                className="h-14 w-14 rounded-input items-center justify-center"
                style={{ borderWidth: 2, borderColor, backgroundColor: '#FAFAFA' }}
              >
                <Text className="font-sans-semibold text-h2 text-navy">
                  {filled ? (show ? chars[i] : '•') : ''}
                </Text>
              </View>
            );
          })}
        </View>
      </Pressable>

      {/* Hidden input that actually captures typing */}
      <TextInput
        ref={ref}
        value={value}
        onChangeText={handle}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        keyboardType="number-pad"
        maxLength={length}
        autoFocus
        caretHidden
        style={{ position: 'absolute', opacity: 0, height: 1, width: 1 }}
      />

      <Pressable onPress={() => setShow((s) => !s)} accessibilityRole="button">
        <Text className="font-sans-medium text-body text-navy/70">
          {show ? 'Hide passcode' : 'Show passcode'}
        </Text>
      </Pressable>
    </View>
  );
}

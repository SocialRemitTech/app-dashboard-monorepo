// apps/mobile/src/shared/ui/OtpInput.tsx
import { useRef, useState } from 'react';
import { View, Text, Pressable, TextInput } from 'react-native';
import { color } from '@sr/design-tokens';

/** Stable N-digit code entry: one hidden input, visible cells are display-only. Capped at `length`. */
export function OtpInput({
  length = 6,
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
  const chars = value.split('');

  const handle = (raw: string) => onChange(raw.replace(/\D/g, '').slice(0, length));

  return (
    <Pressable onPress={() => ref.current?.focus()}>
      <View className="flex-row justify-between">
        {Array.from({ length }).map((_, i) => {
          const filled = i < chars.length;
          const isCursor = focused && i === chars.length;
          const borderColor = error
            ? color.error
            : isCursor
              ? color.coral.DEFAULT
              : color.border.DEFAULT;
          return (
            <View
              key={i}
              className="h-14 w-12 rounded-input items-center justify-center"
              style={{
                borderWidth: 2,
                borderColor,
                backgroundColor: filled ? '#FAFAFA' : color.white,
              }}
            >
              <Text className="font-sans-semibold text-h2 text-navy">{chars[i] ?? ''}</Text>
            </View>
          );
        })}
      </View>
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
    </Pressable>
  );
}

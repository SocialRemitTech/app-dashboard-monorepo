// apps/mobile/src/shared/ui/CodeField.tsx
import { useRef, useState } from 'react';
import { View, Text, TextInput, Pressable } from 'react-native';
import { color } from '@sr/design-tokens';

type Props = {
  value: string;
  onChange: (v: string) => void;
  length?: number;
  /** null neutral · true valid (green) · false error (red) */
  valid?: boolean | null;
  label?: string;
  /** Background behind the floating label — must match the page. */
  labelBackground?: string;
  autoFocus?: boolean;
};

/**
 * Single-container code field: floating label, grouped dashes, digits rendered by us.
 *
 * The real TextInput is a FULL-SIZE overlay at opacity 0 — invisible but focusable.
 * (`color: 'transparent'` is not enough: Android still paints the input's own text and
 * autofill hints, which show through behind the rendered digits.)
 */
export function CodeField({
  value,
  onChange,
  length = 6,
  valid = null,
  label = 'Code',
  labelBackground = color.cream,
  autoFocus = true,
}: Props) {
  const ref = useRef<TextInput>(null);
  const [focused, setFocused] = useState(false);

  const borderColor =
    valid === false
      ? '#D64545'
      : valid === true
        ? '#2E9B63'
        : focused
          ? '#FFC0AA'
          : color.border.DEFAULT;
  const labelColor = valid === false ? '#D64545' : valid === true ? '#2E9B63' : color.coral.DEFAULT;

  return (
    <View>
      <Pressable
        onPress={() => ref.current?.focus()}
        className="rounded-input bg-white"
        style={{
          borderWidth: 2,
          borderColor,
          height: 68,
          justifyContent: 'center',
          paddingHorizontal: 18,
        }}
      >
        <View className="flex-row items-center justify-between" pointerEvents="none">
          {Array.from({ length }).map((_, i) => (
            <View key={i} style={{ marginLeft: i === 3 ? 18 : 0 }}>
              {value[i] ? (
                <Text
                  className="font-display-bold text-navy-deep"
                  style={{ fontSize: 24, width: 22, textAlign: 'center' }}
                >
                  {value[i]}
                </Text>
              ) : (
                <View style={{ width: 22, height: 2, backgroundColor: '#C9CDD3' }} />
              )}
            </View>
          ))}
        </View>

        {/* Full-size invisible input: receives taps and keystrokes, paints nothing. */}
        <TextInput
          ref={ref}
          value={value}
          onChangeText={(t) => onChange(t.replace(/\D/g, '').slice(0, length))}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          keyboardType="number-pad"
          maxLength={length}
          autoFocus={autoFocus}
          caretHidden
          contextMenuHidden
          importantForAutofill="no"
          autoComplete="off"
          autoCorrect={false}
          style={{ position: 'absolute', left: 0, right: 0, top: 0, bottom: 0, opacity: 0 }}
        />
      </Pressable>

      <View
        style={{
          position: 'absolute',
          top: -9,
          left: 14,
          backgroundColor: labelBackground,
          paddingHorizontal: 6,
        }}
      >
        <Text className="font-sans-medium" style={{ fontSize: 13, color: labelColor }}>
          {label}
        </Text>
      </View>
    </View>
  );
}

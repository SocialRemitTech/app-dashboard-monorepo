// apps/mobile/src/shared/ui/ValidatedField.tsx
import { useState, type ReactNode } from 'react';
import { View, Text, TextInput, type TextInputProps } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

/** Feedback-state tokens straight from the Figma spec. */
const STATE = {
  idle: { border: '#E5E7EB', bg: '#FFFFFF' },
  focus: { border: '#FFC0AA', bg: '#FFFFFF' }, // light coral/peach
  valid: { border: '#2E9B63', bg: '#FFFFFF' }, // green
  error: { border: '#D64545', bg: '#FFFFFF' }, // red
};

type Props = TextInputProps & {
  label?: string;
  /** null = neutral (no tick/error), true = valid (green+tick), false = error (red) */
  valid?: boolean | null;
  errorText?: string;
  leftAccessory?: ReactNode;
};

/**
 * The canonical input for the app. When `valid` is true the border turns green (#2E9B63)
 * and a tick appears; false turns it red with an error line; focus shows the peach ring.
 */
export function ValidatedField({
  label,
  valid = null,
  errorText,
  leftAccessory,
  style,
  onFocus,
  onBlur,
  ...props
}: Props) {
  const [focused, setFocused] = useState(false);
  const state = valid === true ? 'valid' : valid === false ? 'error' : focused ? 'focus' : 'idle';
  const tokens = STATE[state];

  return (
    <View>
      {label ? (
        <Text className="font-sans-medium text-navy-deep mb-1.5" style={{ fontSize: 14 }}>
          {label}
        </Text>
      ) : null}
      <View
        className="h-14 rounded-input px-4 flex-row items-center"
        style={{ backgroundColor: tokens.bg, borderWidth: 2, borderColor: tokens.border }}
      >
        {leftAccessory}
        <TextInput
          {...props}
          onFocus={(e) => {
            setFocused(true);
            onFocus?.(e);
          }}
          onBlur={(e) => {
            setFocused(false);
            onBlur?.(e);
          }}
          placeholderTextColor="#9CA3AF"
          className="flex-1 font-sans text-base text-navy"
          style={style}
        />
        {valid === true ? <Ionicons name="checkmark-circle" size={20} color="#2E9B63" /> : null}
        {valid === false ? <Ionicons name="alert-circle" size={20} color="#D64545" /> : null}
      </View>
      {valid === false && errorText ? (
        <Text className="font-sans text-caption mt-1.5" style={{ color: '#D64545' }}>
          {errorText}
        </Text>
      ) : null}
    </View>
  );
}

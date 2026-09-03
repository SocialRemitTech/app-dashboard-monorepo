// apps/mobile/src/shared/ui/TextField.tsx
import { useState } from 'react';
import { View, Text, TextInput, type KeyboardTypeOptions } from 'react-native';
import { color } from '@sr/design-tokens';

export function TextField({
  label,
  value,
  onChangeText,
  placeholder,
  keyboardType,
  error,
  autoFocus,
}: {
  // `| undefined` on the optionals so callers may pass undefined explicitly
  // (required under tsconfig `exactOptionalPropertyTypes: true`).
  label?: string | undefined;
  value: string;
  onChangeText: (t: string) => void;
  placeholder?: string | undefined;
  keyboardType?: KeyboardTypeOptions | undefined;
  error?: string | undefined;
  autoFocus?: boolean | undefined;
}) {
  const [focused, setFocused] = useState(false);
  const borderColor = error ? color.error : focused ? color.coral.DEFAULT : color.border.DEFAULT;
  return (
    <View className="gap-2">
      {label ? <Text className="font-sans-semibold text-label text-navy-deep">{label}</Text> : null}
      <View
        className="h-14 rounded-input bg-white px-4 justify-center"
        style={{ borderWidth: 2, borderColor }}
      >
        <TextInput
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={color.grey.light}
          keyboardType={keyboardType}
          autoFocus={autoFocus}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          className="font-sans text-base text-navy"
        />
      </View>
      {error ? <Text className="font-sans-medium text-caption text-error">{error}</Text> : null}
    </View>
  );
}

// apps/mobile/src/shared/ui/ListRow.tsx
import { View, Text, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { color } from '@sr/design-tokens';

export function ListRow({
  icon,
  title,
  subtitle,
  onPress,
  tint = color.navy.DEFAULT,
  chevron = true,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  subtitle?: string;
  onPress?: () => void;
  tint?: string;
  chevron?: boolean;
}) {
  return (
    <Pressable onPress={onPress} className="flex-row items-center py-3.5">
      <View className="h-9 w-9 rounded-pill bg-coral/10 items-center justify-center mr-3">
        <Ionicons name={icon} size={18} color={color.coral.DEFAULT} />
      </View>
      <View className="flex-1">
        <Text className="font-sans-semibold text-base text-navy-deep" style={{ color: tint }}>
          {title}
        </Text>
        {subtitle ? (
          <Text className="font-sans text-caption text-navy/50 mt-0.5">{subtitle}</Text>
        ) : null}
      </View>
      {chevron ? <Ionicons name="chevron-forward" size={18} color={color.grey.light} /> : null}
    </Pressable>
  );
}

export function SectionLabel({ children }: { children: string }) {
  return (
    <Text className="font-sans-bold text-caption tracking-widest text-navy/40 mt-6 mb-1">
      {children}
    </Text>
  );
}

// apps/mobile/src/shared/ui/PageHeader.tsx
import { View, Text } from 'react-native';
import { BackButton } from './BackButton';

export function PageHeader({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <View className="pt-2">
      <BackButton fallback="/(app)/(tabs)/profile" />
      <Text className="font-display-bold text-navy-deep mt-4" style={{ fontSize: 28 }}>
        {title}
      </Text>
      {subtitle ? <Text className="font-sans text-body text-navy/55 mt-1">{subtitle}</Text> : null}
    </View>
  );
}

/** Label + value row for read-only detail fields. */
export function FieldRow({
  label,
  value,
  muted,
}: {
  label: string;
  value: string;
  muted?: boolean;
}) {
  return (
    <View className="flex-row items-center justify-between py-3.5 border-b border-border-divider">
      <Text className="font-sans text-body text-navy/55">{label}</Text>
      <Text className={`font-sans-semibold text-body ${muted ? 'text-navy/35' : 'text-navy-deep'}`}>
        {value}
      </Text>
    </View>
  );
}

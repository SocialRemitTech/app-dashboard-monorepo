// apps/mobile/src/features/home/components/EmailPromptSheet.tsx
import { View, Text, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { BottomSheet } from '@/shared/ui/BottomSheet';
import { Button } from '@/shared/ui/Button';
import { color } from '@sr/design-tokens';

const BENEFITS: { icon: keyof typeof Ionicons.glyphMap; label: string }[] = [
  { icon: 'document-text-outline', label: 'Transfer receipts' },
  { icon: 'time-outline', label: 'Delivery confirmations' },
  { icon: 'shield-checkmark-outline', label: 'Security alerts' },
  { icon: 'settings-outline', label: 'Change it anytime' },
];

export function EmailPromptSheet({ visible, onClose }: { visible: boolean; onClose: () => void }) {
  return (
    <BottomSheet visible={visible} onClose={onClose}>
      <View className="flex-row justify-end">
        <Pressable onPress={onClose}>
          <Ionicons name="close" size={22} color={color.grey.mid} />
        </Pressable>
      </View>
      <View className="items-center gap-3">
        <View className="h-16 w-16 rounded-pill bg-coral/10 items-center justify-center">
          <Ionicons name="mail-outline" size={28} color={color.coral.DEFAULT} />
        </View>
        <Text className="font-display-bold text-navy-deep text-center" style={{ fontSize: 22 }}>
          Add your email address
        </Text>
        <Text className="font-sans text-body text-navy/55 text-center">
          Get transfer receipts and important account updates.
        </Text>
      </View>

      <View className="gap-1 mt-5">
        {BENEFITS.map((b) => (
          <View key={b.label} className="flex-row items-center py-2 gap-3">
            <View className="h-9 w-9 rounded-input bg-coral/10 items-center justify-center">
              <Ionicons name={b.icon} size={18} color={color.coral.DEFAULT} />
            </View>
            <Text className="font-sans-semibold text-base text-navy-deep">{b.label}</Text>
          </View>
        ))}
      </View>

      <View className="mt-5 gap-3">
        <Button label="Add email address" onPress={onClose} />
        <Pressable onPress={onClose} className="items-center py-1">
          <Text className="font-sans-medium text-body text-navy/45">Not now</Text>
        </Pressable>
      </View>
    </BottomSheet>
  );
}

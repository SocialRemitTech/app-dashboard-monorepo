// apps/mobile/src/shared/ui/ContactSupportFooter.tsx
import { View, Text, Pressable } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { color } from '@sr/design-tokens';

/** "Need help? Contact Support" — appears at the foot of every full account page. */
export function ContactSupportFooter({ className = '' }: { className?: string }) {
  return (
    <Pressable
      onPress={() => router.push('/(app)/support')}
      className={`flex-row items-center justify-center gap-2 py-5 ${className}`}
    >
      <Ionicons name="chatbubble-ellipses-outline" size={17} color={color.grey.mid} />
      <Text className="font-sans text-navy/55" style={{ fontSize: 15 }}>
        Need help?
      </Text>
      <Text className="font-sans-bold text-navy-deep" style={{ fontSize: 15 }}>
        Contact Support
      </Text>
    </Pressable>
  );
}

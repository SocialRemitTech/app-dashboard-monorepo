// apps/mobile/src/features/home/components/EmailPromptSheet.tsx
import { useState } from 'react';
import {
  View,
  Text,
  Modal,
  Pressable,
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Button } from '@/shared/ui/Button';
import { usePreferences } from '@/features/profile/stores/preferences.store';
import { color } from '@sr/design-tokens';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function EmailPromptSheet({ visible, onClose }: { visible: boolean; onClose: () => void }) {
  const setEmail = usePreferences((s) => s.setEmail);
  const dismiss = usePreferences((s) => s.dismissEmailPrompt);
  const [value, setValue] = useState('');
  const valid = EMAIL_RE.test(value.trim());

  const save = () => {
    if (!valid) return;
    setEmail(value.trim());
    onClose();
  }; // persisted → won't show again
  const later = () => {
    dismiss();
    onClose();
  }; // persisted → won't show again

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={later}>
      <Pressable className="flex-1 bg-black/40" onPress={later} />
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <View
          className="bg-white rounded-t-sheet px-5 pt-5 pb-8"
          style={{ borderTopLeftRadius: 24, borderTopRightRadius: 24 }}
        >
          <View className="items-center mb-3">
            <View className="h-1 w-10 rounded-pill bg-border" />
          </View>
          <View className="h-12 w-12 rounded-card bg-coral/10 items-center justify-center mb-3">
            <Ionicons name="mail-outline" size={24} color={color.coral.DEFAULT} />
          </View>
          <Text className="font-display-bold text-navy-deep" style={{ fontSize: 22 }}>
            Add your email
          </Text>
          <Text className="font-sans text-body text-navy/55 mt-1">
            Get transfer receipts and important account updates by email.
          </Text>

          <View className="h-14 rounded-input bg-white border-2 border-border px-4 justify-center mt-4">
            <TextInput
              value={value}
              onChangeText={setValue}
              placeholder="you@example.com"
              placeholderTextColor={color.grey.light}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              className="font-sans text-base text-navy"
            />
          </View>

          <View className="mt-4">
            <Button label="Save email" onPress={save} disabled={!valid} />
          </View>
          <Pressable onPress={later} className="items-center py-3 mt-1">
            <Text className="font-sans-semibold text-body text-navy/55">Maybe later</Text>
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

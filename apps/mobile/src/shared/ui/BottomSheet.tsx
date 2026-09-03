// apps/mobile/src/shared/ui/BottomSheet.tsx
import type { ReactNode } from 'react';
import { Modal, View, Pressable } from 'react-native';

/** Lightweight bottom sheet built on RN Modal (no @gorhom dependency yet). */
export function BottomSheet({
  visible,
  onClose,
  children,
}: {
  visible: boolean;
  onClose: () => void;
  children: ReactNode;
}) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
      statusBarTranslucent
    >
      <Pressable className="flex-1 bg-black/40 justify-end" onPress={onClose}>
        <Pressable
          className="bg-cream px-5 pt-3 pb-8"
          style={{ borderTopLeftRadius: 28, borderTopRightRadius: 28 }}
        >
          <View className="self-center h-1 w-10 rounded-pill bg-navy/15 mb-4" />
          {children}
        </Pressable>
      </Pressable>
    </Modal>
  );
}

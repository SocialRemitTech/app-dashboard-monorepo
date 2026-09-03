// apps/mobile/src/features/profile/components/AccountStateSheet.tsx
import { View, Text, Modal, Pressable, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import {
  useAccountState,
  ACCOUNT_STATES,
  ACCOUNT_STATE_LABELS,
  type AccountState,
} from '@/features/profile/stores/accountState.store';
import { color } from '@sr/design-tokens';

/** Long enough for the Modal slide-out to finish before we navigate. */
const DISMISS_MS = 320;

type Props = {
  visible: boolean;
  onClose: () => void;
  /** Fired AFTER the sheet has finished dismissing, so navigation isn't swallowed. */
  onSelect?: (state: AccountState) => void;
};

export function AccountStateSheet({ visible, onClose, onSelect }: Props) {
  const current = useAccountState((s) => s.state);
  const setState = useAccountState((s) => s.setState);

  const choose = (s: AccountState) => {
    setState(s);
    onClose();
    // Navigating while the Modal is still animating out drops the push on both platforms.
    if (onSelect) setTimeout(() => onSelect(s), DISMISS_MS);
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <Pressable
        className="flex-1"
        style={{ backgroundColor: 'rgba(0,0,0,0.45)' }}
        onPress={onClose}
      />
      <View
        className="bg-white px-5 pt-4 pb-8"
        style={{ borderTopLeftRadius: 24, borderTopRightRadius: 24 }}
      >
        <View className="items-center mb-3">
          <View className="h-1 w-10 rounded-pill" style={{ backgroundColor: '#D8D5D0' }} />
        </View>

        <View className="flex-row items-start justify-between">
          <View className="flex-1 pr-4">
            <Text className="font-display-bold text-navy-deep" style={{ fontSize: 22 }}>
              Choose a Personal Details state
            </Text>
            <Text className="font-sans text-navy/50 mt-1.5" style={{ fontSize: 14 }}>
              Prototype review only — customers will not see this
            </Text>
          </View>
          <Pressable
            onPress={onClose}
            className="h-9 w-9 rounded-pill items-center justify-center"
            style={{ backgroundColor: '#F1F0EE' }}
          >
            <Ionicons name="close" size={18} color={color.navy.deep} />
          </Pressable>
        </View>

        <ScrollView
          className="mt-5"
          style={{ maxHeight: 420 }}
          showsVerticalScrollIndicator={false}
        >
          {ACCOUNT_STATES.map((s, i) => {
            const active = s === current;
            return (
              <Pressable
                key={s}
                onPress={() => choose(s)}
                className={`flex-row items-center py-4 ${i === 0 ? '' : 'border-t border-border-divider'}`}
              >
                <Text
                  className={active ? 'font-sans-bold' : 'font-sans'}
                  style={{ fontSize: 17, color: color.navy.deep }}
                >
                  {ACCOUNT_STATE_LABELS[s]}
                </Text>
                <View className="flex-1" />
                {active ? (
                  <Ionicons name="checkmark" size={20} color={color.coral.DEFAULT} />
                ) : null}
              </Pressable>
            );
          })}
        </ScrollView>
      </View>
    </Modal>
  );
}

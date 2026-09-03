// apps/mobile/src/features/profile/components/SetupAccountSheet.tsx
import { View, Text, Modal, Pressable } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useAccountState, type SetupStep } from '@/features/profile/stores/accountState.store';
import { color } from '@sr/design-tokens';

const DISMISS_MS = 320;

const ITEMS: { step: SetupStep; icon: keyof typeof Ionicons.glyphMap; label: string }[] = [
  { step: 'identity', icon: 'person-outline', label: 'Legal name and date of birth' },
  { step: 'address', icon: 'location-outline', label: 'Home address and postcode' },
  { step: 'email', icon: 'mail-outline', label: 'Email address' },
  {
    step: 'extra',
    icon: 'document-text-outline',
    label: 'Other information required to set up and verify the account',
  },
];

/** "Get started" RESUMES at the first outstanding step; completed items show a green tick. */
export function SetupAccountSheet({ visible, onClose }: { visible: boolean; onClose: () => void }) {
  const stepsDone = useAccountState((s) => s.stepsDone);
  const resumeRoute = useAccountState((s) => s.resumeRoute);
  const anyDone = ITEMS.some((i) => stepsDone[i.step]);

  const start = () => {
    const target = resumeRoute();
    onClose();
    setTimeout(() => router.push(target as never), DISMISS_MS);
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
        style={{ borderTopLeftRadius: 26, borderTopRightRadius: 26 }}
      >
        <View className="items-center mb-2">
          <View className="h-1 w-10 rounded-pill" style={{ backgroundColor: '#D8D5D0' }} />
        </View>

        <View className="flex-row items-start">
          <Text className="flex-1 font-display-bold text-navy-deep" style={{ fontSize: 27 }}>
            Set up your account
          </Text>
          <Pressable
            onPress={onClose}
            className="h-9 w-9 rounded-pill items-center justify-center"
            style={{ backgroundColor: '#F1F0EE' }}
          >
            <Ionicons name="close" size={18} color={color.navy.deep} />
          </Pressable>
        </View>

        <Text className="font-sans text-navy/60 mt-2.5" style={{ fontSize: 16, lineHeight: 24 }}>
          To send money, we'll need a few details from you. You can stop and return at any time.
        </Text>

        <View className="rounded-card mt-6" style={{ backgroundColor: '#FAF8F5' }}>
          {ITEMS.map((it, i) => {
            const done = stepsDone[it.step];
            return (
              <View
                key={it.step}
                className={`flex-row items-center px-4 py-4 ${i === 0 ? '' : 'border-t border-border-divider'}`}
              >
                <View
                  className="h-10 w-10 rounded-input items-center justify-center mr-3"
                  style={{ backgroundColor: done ? 'rgba(46,155,99,0.10)' : color.white }}
                >
                  <Ionicons
                    name={done ? 'checkmark' : it.icon}
                    size={20}
                    color={done ? '#2E9B63' : color.navy.deep}
                  />
                </View>
                <Text
                  className="flex-1 font-sans text-navy-deep"
                  style={{ fontSize: 16, lineHeight: 22 }}
                >
                  {it.label}
                </Text>
              </View>
            );
          })}
        </View>

        <Pressable
          onPress={start}
          className="rounded-button items-center justify-center mt-6"
          style={{ height: 58, backgroundColor: color.coral.DEFAULT }}
        >
          <Text className="font-sans-bold text-white" style={{ fontSize: 17 }}>
            {anyDone ? 'Continue setup' : 'Get started'}
          </Text>
        </Pressable>

        <Pressable onPress={onClose} className="items-center py-4 mt-1">
          <Text className="font-sans-semibold text-navy-deep" style={{ fontSize: 17 }}>
            Not now
          </Text>
        </Pressable>
      </View>
    </Modal>
  );
}

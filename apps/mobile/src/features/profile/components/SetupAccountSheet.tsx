// apps/mobile/src/features/profile/components/SetupAccountSheet.tsx
import { View, Text, Modal, Pressable } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import {
  useAccountState,
  SETUP_STEPS,
  type SetupStep,
} from '@/features/profile/stores/accountState.store';
import { color } from '@sr/design-tokens';

/** Long enough for the Modal slide-out to finish before navigating. */
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

/**
 * The single funnel for every account CTA — "Complete setup", "Verify now",
 * "Continue verification" and "View progress" all land here.
 *
 * Completed items show a green tick, the outstanding one is highlighted, and the button
 * RESUMES at the first incomplete step rather than restarting the journey.
 */
export function SetupAccountSheet({ visible, onClose }: { visible: boolean; onClose: () => void }) {
  const stepsDone = useAccountState((s) => s.stepsDone);
  const state = useAccountState((s) => s.state);
  const resumeRoute = useAccountState((s) => s.resumeRoute);

  const doneCount = SETUP_STEPS.filter((s) => stepsDone[s]).length;
  const allDone = doneCount === SETUP_STEPS.length;
  const nextStep = SETUP_STEPS.find((s) => !stepsDone[s]);

  const label = allDone ? 'View progress' : doneCount > 0 ? 'Continue setup' : 'Get started';
  const heading = allDone ? 'Your verification' : 'Set up your account';
  const blurb = allDone
    ? "We have everything we need. We'll let you know as soon as the checks are complete."
    : "To send money, we'll need a few details from you. You can stop and return at any time.";

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
            {heading}
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
          {blurb}
        </Text>

        {/* Progress counter — makes "resume" legible at a glance */}
        {doneCount > 0 ? (
          <Text className="font-sans-semibold text-navy/45 mt-4" style={{ fontSize: 13 }}>
            {doneCount} of {SETUP_STEPS.length} complete
          </Text>
        ) : null}

        <View className="rounded-card mt-3" style={{ backgroundColor: '#FAF8F5' }}>
          {ITEMS.map((it, i) => {
            const done = stepsDone[it.step];
            const isNext = !done && it.step === nextStep;
            return (
              <View
                key={it.step}
                className={`flex-row items-center px-4 py-4 ${i === 0 ? '' : 'border-t border-border-divider'}`}
              >
                <View
                  className="h-10 w-10 rounded-input items-center justify-center mr-3"
                  style={{
                    backgroundColor: done
                      ? 'rgba(46,155,99,0.10)'
                      : isNext
                        ? 'rgba(255,90,42,0.10)'
                        : color.white,
                  }}
                >
                  <Ionicons
                    name={done ? 'checkmark' : it.icon}
                    size={20}
                    color={done ? '#2E9B63' : isNext ? color.coral.DEFAULT : color.navy.deep}
                  />
                </View>
                <Text
                  className={isNext ? 'flex-1 font-sans-bold' : 'flex-1 font-sans'}
                  style={{
                    fontSize: 16,
                    lineHeight: 22,
                    color: done ? color.navy.deep + 'A6' : color.navy.deep,
                  }}
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
          style={{
            height: 58,
            backgroundColor: state === 'verification_in_progress' ? '#F0A020' : color.coral.DEFAULT,
          }}
        >
          <Text className="font-sans-bold text-white" style={{ fontSize: 17 }}>
            {label}
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

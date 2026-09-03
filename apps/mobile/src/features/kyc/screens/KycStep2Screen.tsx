// apps/mobile/src/features/kyc/screens/KycStep2Screen.tsx
import { View, Text, Pressable } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { KeyboardAwareScreen } from '@/shared/ui/KeyboardAwareScreen';
import { Button } from '@/shared/ui/Button';
import { ContactSupportFooter } from '@/shared/ui/ContactSupportFooter';
import { useKyc } from '@/features/kyc/stores/kyc.store';
import { useAccountState } from '@/features/profile/stores/accountState.store';
import { color } from '@sr/design-tokens';

const RELATIONSHIPS = [
  'Mother',
  'Father',
  'Sister',
  'Brother',
  'Son',
  'Daughter',
  'Spouse',
  'Friend',
  'Business',
  'Myself',
  'Other',
];

const PURPOSES = [
  'Family support',
  'School fees',
  'Medical costs',
  'Rent or bills',
  'Savings',
  'Business payment',
  'Gift',
  'Other',
];

/** STEP 2 OF 2 — why you're sending. Mirrors step 1's header, chips, and footer. */
export function KycStep2Screen() {
  const k = useKyc();
  const setAccountState = useAccountState((s) => s.setState);
  const markStepDone = useAccountState((s) => s.markStepDone);

  const canContinue = k.relationship.length > 0 && k.purpose.length > 0;

  const submit = () => {
    k.setStatus('review'); // KycStatus: not_started | in_progress | verified | review | rejected
    markStepDone('extra');
    setAccountState('verification_in_progress');
    router.replace('/(app)/account/verifying' as never);
  };

  return (
    <KeyboardAwareScreen
      footer={
        <View className="pb-2">
          <Button label="Submit for verification" onPress={submit} disabled={!canContinue} />
        </View>
      }
    >
      <View className="pt-2 flex-row items-center justify-between">
        <Pressable
          onPress={() => router.back()}
          className="h-11 w-11 rounded-pill bg-white border border-border/60 items-center justify-center"
        >
          <Ionicons name="arrow-back" size={20} color={color.navy.deep} />
        </Pressable>
        <Text className="font-sans-semibold text-navy-deep" style={{ fontSize: 15 }}>
          Need help?
        </Text>
      </View>

      <Text
        className="font-sans-semibold tracking-wider text-navy/45 text-center mt-6"
        style={{ fontSize: 12 }}
      >
        STEP 2 OF 2
      </Text>
      <Text className="font-display-bold text-navy-deep text-center mt-2" style={{ fontSize: 31 }}>
        About your transfers
      </Text>
      <Text className="font-sans text-navy/55 text-center mt-2" style={{ fontSize: 16 }}>
        Regulations require us to ask. It only takes a moment.
      </Text>

      <Text className="font-sans-medium text-navy-deep mt-8 mb-3" style={{ fontSize: 15 }}>
        Who are you usually sending to?
      </Text>
      <ChipGroup
        options={RELATIONSHIPS}
        value={k.relationship}
        onChange={(v) => k.set({ relationship: v })}
      />

      <Text className="font-sans-medium text-navy-deep mt-7 mb-3" style={{ fontSize: 15 }}>
        What are these transfers usually for?
      </Text>
      <ChipGroup options={PURPOSES} value={k.purpose} onChange={(v) => k.set({ purpose: v })} />

      <View
        className="rounded-card mt-7 px-4 py-3.5 flex-row items-start gap-2.5"
        style={{ backgroundColor: 'rgba(11,37,89,0.04)' }}
      >
        <Ionicons
          name="lock-closed-outline"
          size={16}
          color={color.navy.deep}
          style={{ marginTop: 2 }}
        />
        <Text className="flex-1 font-sans text-navy/65" style={{ fontSize: 14, lineHeight: 20 }}>
          We only use this to meet UK money-transfer regulations. It is never shared for marketing.
        </Text>
      </View>

      <ContactSupportFooter />
    </KeyboardAwareScreen>
  );
}

function ChipGroup({
  options,
  value,
  onChange,
}: {
  options: string[];
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <View className="flex-row flex-wrap gap-2.5">
      {options.map((o) => {
        const on = value === o;
        return (
          <Pressable
            key={o}
            onPress={() => onChange(o)}
            className="rounded-pill px-4 py-2.5"
            style={{
              backgroundColor: on ? 'rgba(255,90,42,0.10)' : color.white,
              borderWidth: on ? 2 : 1,
              borderColor: on ? color.coral.DEFAULT : color.border.DEFAULT,
            }}
          >
            <Text
              className={on ? 'font-sans-bold' : 'font-sans'}
              style={{ fontSize: 15, color: on ? color.coral.DEFAULT : color.navy.deep }}
            >
              {o}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

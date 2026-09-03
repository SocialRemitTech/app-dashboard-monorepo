// apps/mobile/src/features/kyc/screens/KycStep1Screen.tsx
import { useState } from 'react';
import { View, Text, Pressable, TextInput } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { KeyboardAwareScreen } from '@/shared/ui/KeyboardAwareScreen';
import { Button } from '@/shared/ui/Button';
import { ValidatedField } from '@/shared/ui/ValidatedField';
import { ContactSupportFooter } from '@/shared/ui/ContactSupportFooter';
import { useKyc } from '@/features/kyc/stores/kyc.store';
import { useAccountState } from '@/features/profile/stores/accountState.store';
import { color } from '@sr/design-tokens';

export function KycStep1Screen() {
  const k = useKyc();
  const markStepDone = useAccountState((s) => s.markStepDone);
  const setDetails = useAccountState((s) => s.setDetails);
  const resumeRoute = useAccountState((s) => s.resumeRoute);
  const [postcode, setPostcode] = useState('');
  const [addressFound, setAddressFound] = useState(false);

  const nameOk = k.legalName.trim().split(/\s+/).filter(Boolean).length >= 2;
  const dobOk = k.dobDay.length >= 1 && k.dobMonth.length >= 1 && k.dobYear.length === 4;
  const canContinue = nameOk && dobOk && (addressFound || k.addressLine1.trim().length > 2);

  /** Persist what step 1 collected, then jump to whatever is still outstanding. */
  const continueStep = () => {
    const dob = [k.dobDay, k.dobMonth, k.dobYear].filter(Boolean).join('/');
    setDetails({
      legalName: k.legalName.trim(),
      dateOfBirth: dob,
      homeAddress: [k.addressLine1, k.city, k.postcode].filter((p) => p && p.trim()).join(', '),
    });
    markStepDone('identity', 'address');
    router.replace(resumeRoute() as never);
  };

  const findAddress = () => {
    if (postcode.trim().length < 3) return;
    k.set({ postcode: postcode.trim().toUpperCase(), addressLine1: '14 Elm Road', city: 'London' });
    setAddressFound(true);
  };

  return (
    <KeyboardAwareScreen
      footer={
        <View className="pb-2">
          <Button label="Continue" onPress={continueStep} disabled={!canContinue} />
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
        STEP 1 OF 2
      </Text>
      <Text className="font-display-bold text-navy-deep text-center mt-2" style={{ fontSize: 31 }}>
        Tell us about yourself
      </Text>
      <Text className="font-sans text-navy/55 text-center mt-2" style={{ fontSize: 16 }}>
        This helps us keep your transfers secure.
      </Text>

      <View className="mt-7">
        <ValidatedField
          label="Your full legal name (as it appears on your ID)"
          value={k.legalName}
          onChangeText={(t) => k.set({ legalName: t })}
          placeholder="e.g. Joseph Owusu"
          valid={k.legalName.length === 0 ? null : nameOk}
          errorText="Enter your first and last name"
        />
      </View>

      <Text className="font-sans-medium text-navy-deep mt-6 mb-2" style={{ fontSize: 15 }}>
        Date of birth
      </Text>
      <View className="flex-row gap-3">
        <DobBox
          value={k.dobDay}
          onChangeText={(t) => k.set({ dobDay: t.replace(/\D/g, '').slice(0, 2) })}
          placeholder="DD"
          max={2}
        />
        <DobBox
          value={k.dobMonth}
          onChangeText={(t) => k.set({ dobMonth: t.replace(/\D/g, '').slice(0, 2) })}
          placeholder="MM"
          max={2}
        />
        <DobBox
          value={k.dobYear}
          onChangeText={(t) => k.set({ dobYear: t.replace(/\D/g, '').slice(0, 4) })}
          placeholder="YYYY"
          max={4}
          flex={1.5}
        />
      </View>

      <Text className="font-sans-medium text-navy-deep mt-6 mb-2" style={{ fontSize: 15 }}>
        Nationality
      </Text>
      <Pressable
        className="h-14 rounded-input bg-white px-4 flex-row items-center justify-between"
        style={{ borderWidth: 2, borderColor: color.border.DEFAULT }}
      >
        <Text className="font-sans text-navy-deep" style={{ fontSize: 16 }}>
          {k.nationality || 'United Kingdom'}
        </Text>
        <Ionicons name="chevron-down" size={18} color={color.grey.mid} />
      </Pressable>

      <Text className="font-sans-medium text-navy-deep mt-6 mb-2" style={{ fontSize: 15 }}>
        Postcode
      </Text>
      <View className="flex-row gap-3">
        <View
          className="flex-1 h-14 rounded-input bg-white px-4 justify-center"
          style={{ borderWidth: 2, borderColor: addressFound ? '#2E9B63' : color.border.DEFAULT }}
        >
          <TextInput
            value={postcode}
            onChangeText={(t) => {
              setPostcode(t);
              setAddressFound(false);
            }}
            placeholder="e.g. SW1A 1AA"
            placeholderTextColor="#B9B5AE"
            autoCapitalize="characters"
            className="font-sans text-base text-navy"
          />
        </View>
        <Pressable
          onPress={findAddress}
          className="rounded-input items-center justify-center px-7"
          style={{ height: 56, backgroundColor: color.coral.DEFAULT }}
        >
          <Text className="font-sans-bold text-white" style={{ fontSize: 16 }}>
            Find
          </Text>
        </Pressable>
      </View>

      {addressFound ? (
        <View
          className="rounded-card mt-3 px-4 py-3 flex-row items-center gap-2"
          style={{ backgroundColor: 'rgba(46,155,99,0.06)' }}
        >
          <Ionicons name="checkmark-circle" size={17} color="#2E9B63" />
          <Text className="flex-1 font-sans text-navy-deep" style={{ fontSize: 15 }}>
            {k.addressLine1}, {k.city} {k.postcode}
          </Text>
        </View>
      ) : null}

      <Pressable
        onPress={() => k.set({ addressLine1: k.addressLine1 || ' ' })}
        className="items-center mt-5"
      >
        <Text className="font-sans-semibold text-navy-deep underline" style={{ fontSize: 16 }}>
          Can't find your address? Enter manually
        </Text>
      </Pressable>

      <ContactSupportFooter />
    </KeyboardAwareScreen>
  );
}

function DobBox({
  value,
  onChangeText,
  placeholder,
  max,
  flex = 1,
}: {
  value: string;
  onChangeText: (t: string) => void;
  placeholder: string;
  max: number;
  flex?: number;
}) {
  return (
    <View
      className="h-14 rounded-input bg-white px-4 justify-center"
      style={{ flex, borderWidth: 2, borderColor: color.border.DEFAULT }}
    >
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        keyboardType="number-pad"
        maxLength={max}
        placeholderTextColor="#B9B5AE"
        className="font-sans text-base text-navy text-center"
      />
    </View>
  );
}

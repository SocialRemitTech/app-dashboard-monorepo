// apps/mobile/src/features/kyc/screens/AboutYouScreen.tsx
import { View, Text, TextInput } from 'react-native';
import { router } from 'expo-router';
import { KeyboardAwareScreen } from '@/shared/ui/KeyboardAwareScreen';
import { BackButton } from '@/shared/ui/BackButton';
import { Button } from '@/shared/ui/Button';
import { useKyc } from '@/features/kyc/stores/kyc.store';
import { color } from '@sr/design-tokens';

export function AboutYouScreen() {
  const k = useKyc();
  const nameOk = k.legalName.trim().split(/\s+/).filter(Boolean).length >= 2;
  const dobOk = k.dobDay.length >= 1 && k.dobMonth.length >= 1 && k.dobYear.length === 4;
  const canContinue =
    nameOk && dobOk && k.addressLine1.trim().length > 2 && k.postcode.trim().length > 2;

  return (
    <KeyboardAwareScreen
      footer={
        <View className="pb-2">
          <Button
            label="Continue"
            onPress={() => router.push('/(app)/kyc/about-transfer')}
            disabled={!canContinue}
          />
        </View>
      }
    >
      <View className="pt-2">
        <BackButton fallback="/(app)/kyc" />
      </View>
      <Text className="font-sans-semibold text-caption text-coral mt-3">STEP 1 OF 2</Text>
      <Text className="font-display-bold text-navy-deep mt-1" style={{ fontSize: 26 }}>
        About you
      </Text>
      <Text className="font-sans text-body text-navy/55 mt-1">
        This must match your government-issued ID.
      </Text>

      <View className="mt-6 gap-4">
        <Field label="Legal full name">
          <TextInput
            value={k.legalName}
            onChangeText={(t) => k.set({ legalName: t })}
            placeholder="First and last name"
            placeholderTextColor={color.grey.light}
            className="font-sans text-base text-navy"
          />
        </Field>

        <View>
          <Text className="font-sans-medium text-label text-navy/55 mb-1.5">Date of birth</Text>
          <View className="flex-row gap-3">
            <DobBox
              value={k.dobDay}
              onChangeText={(t) => k.set({ dobDay: t.replace(/[^\d]/g, '').slice(0, 2) })}
              placeholder="DD"
              max={2}
            />
            <DobBox
              value={k.dobMonth}
              onChangeText={(t) => k.set({ dobMonth: t.replace(/[^\d]/g, '').slice(0, 2) })}
              placeholder="MM"
              max={2}
            />
            <DobBox
              value={k.dobYear}
              onChangeText={(t) => k.set({ dobYear: t.replace(/[^\d]/g, '').slice(0, 4) })}
              placeholder="YYYY"
              max={4}
              flex={1.6}
            />
          </View>
        </View>

        <Field label="Nationality">
          <TextInput
            value={k.nationality}
            onChangeText={(t) => k.set({ nationality: t })}
            placeholder="e.g. United Kingdom"
            placeholderTextColor={color.grey.light}
            className="font-sans text-base text-navy"
          />
        </Field>
        <Field label="Address line 1">
          <TextInput
            value={k.addressLine1}
            onChangeText={(t) => k.set({ addressLine1: t })}
            placeholder="Street address"
            placeholderTextColor={color.grey.light}
            className="font-sans text-base text-navy"
          />
        </Field>
        <Field label="Address line 2 (optional)">
          <TextInput
            value={k.addressLine2}
            onChangeText={(t) => k.set({ addressLine2: t })}
            placeholder="Apartment, suite, etc."
            placeholderTextColor={color.grey.light}
            className="font-sans text-base text-navy"
          />
        </Field>
        <Field label="City">
          <TextInput
            value={k.city}
            onChangeText={(t) => k.set({ city: t })}
            placeholder="City"
            placeholderTextColor={color.grey.light}
            className="font-sans text-base text-navy"
          />
        </Field>
        <Field label="Postcode">
          <TextInput
            value={k.postcode}
            onChangeText={(t) => k.set({ postcode: t })}
            placeholder="Postcode"
            autoCapitalize="characters"
            placeholderTextColor={color.grey.light}
            className="font-sans text-base text-navy"
            returnKeyType="done"
          />
        </Field>
      </View>
    </KeyboardAwareScreen>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <View>
      <Text className="font-sans-medium text-label text-navy/55 mb-1.5">{label}</Text>
      <View className="h-14 rounded-input bg-white border-2 border-border px-4 justify-center">
        {children}
      </View>
    </View>
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
      className="h-14 rounded-input bg-white border-2 border-border px-4 justify-center"
      style={{ flex }}
    >
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        keyboardType="number-pad"
        maxLength={max}
        placeholderTextColor={color.grey.light}
        className="font-sans text-base text-navy text-center"
      />
    </View>
  );
}

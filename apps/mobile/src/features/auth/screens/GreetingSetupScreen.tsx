// apps/mobile/src/features/auth/screens/GreetingSetupScreen.tsx
import { View, Text, Pressable } from 'react-native';
import { router } from 'expo-router';
import { KeyboardAwareScreen } from '@/shared/ui/KeyboardAwareScreen';
import { Button } from '@/shared/ui/Button';
import { ValidatedField } from '@/shared/ui/ValidatedField';
import { Ionicons } from '@expo/vector-icons';
import { useProfile } from '@/features/profile/stores/profile.store';
import { color } from '@sr/design-tokens';

export function GreetingSetupScreen() {
  const { preferredName, greeting, set } = useProfile();
  const nameValid = preferredName.trim().length === 0 ? null : preferredName.trim().length >= 2;
  const greetingValid = greeting.trim().length === 0 ? null : greeting.trim().length >= 2;
  const canContinue = preferredName.trim().length >= 2;

  const previewText =
    greeting.trim() && preferredName.trim()
      ? `${greeting.trim()}, ${preferredName.trim()}`
      : 'Your greeting will appear here';

  return (
    <KeyboardAwareScreen
      footer={
        <View className="pb-2">
          <Button
            label="Continue"
            onPress={() => router.replace('/(auth)/greeting')}
            disabled={!canContinue}
          />
          <Pressable
            onPress={() => router.replace('/(auth)/greeting')}
            className="items-center py-3 flex-row justify-center gap-1"
          >
            <Text className="font-sans-semibold text-body text-navy-deep">Skip for now</Text>
            <Ionicons name="arrow-forward" size={16} color={color.navy.deep} />
          </Pressable>
        </View>
      }
    >
      <Text
        className="font-display-bold text-navy-deep mt-6"
        style={{ fontSize: 30, lineHeight: 36 }}
      >
        How do you want us to greet you?
      </Text>
      <Text className="font-sans text-body text-navy/55 mt-2">Make it feel like home.</Text>

      <View className="mt-6">
        <ValidatedField
          label="Preferred name"
          value={preferredName}
          onChangeText={(t) => set({ preferredName: t })}
          placeholder="e.g., Joe, Kwame, Ama, Alex"
          valid={nameValid}
        />
      </View>

      <View className="mt-5">
        <ValidatedField
          label="How should we greet you?"
          value={greeting}
          onChangeText={(t) => set({ greeting: t })}
          placeholder="e.g., Akwaaba, Karibu, Namaste, Habari…"
          valid={greetingValid}
        />
      </View>
      <Text className="font-sans text-caption text-navy/45 mt-2">
        Type in any language — this is how we'll welcome you every time you log in.
      </Text>

      <View className="rounded-card mt-6 px-4 py-4" style={{ backgroundColor: '#FDECD9' }}>
        <Text className="font-sans-semibold text-caption tracking-wider text-navy/45">PREVIEW</Text>
        <Text
          className="font-display-bold mt-1"
          style={{
            fontSize: 20,
            color: preferredName.trim() && greeting.trim() ? color.navy.deep : '#B8A99A',
          }}
        >
          {previewText}
        </Text>
      </View>
    </KeyboardAwareScreen>
  );
}

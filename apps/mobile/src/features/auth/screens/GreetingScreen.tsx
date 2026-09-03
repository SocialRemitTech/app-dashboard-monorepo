// apps/mobile/src/features/auth/screens/GreetingScreen.tsx
import { View, Text, Pressable } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { KeyboardAwareScreen } from '@/shared/ui/KeyboardAwareScreen';
import { Button } from '@/shared/ui/Button';
import { ValidatedField } from '@/shared/ui/ValidatedField';
import { useOnboarding } from '@/features/auth/stores/onboarding.store';
import { useProfile } from '@/features/profile/stores/profile.store';
import { color } from '@sr/design-tokens';

/** "How do you want us to greet you?" — centered heading, live preview card. */
export function GreetingScreen() {
  const { preferredName, greeting, set } = useOnboarding();
  const setProfile = useProfile((s) => s.set);

  const nameValid = preferredName.trim().length === 0 ? null : preferredName.trim().length >= 2;
  const greetingValid = greeting.trim().length === 0 ? null : greeting.trim().length >= 2;
  const canContinue = preferredName.trim().length >= 2;
  const ready = !!(preferredName.trim() && greeting.trim());

  const commit = () => {
    setProfile({ preferredName: preferredName.trim(), greeting: greeting.trim() });
    router.push('/(auth)/get-acquainted');
  };

  return (
    <KeyboardAwareScreen
      footer={
        <View className="pb-2">
          <Button label="Continue" onPress={commit} disabled={!canContinue} />
          <Pressable
            onPress={() => router.push('/(auth)/get-acquainted')}
            className="items-center py-4 flex-row justify-center gap-1.5"
          >
            <Text className="font-sans-semibold text-navy-deep" style={{ fontSize: 16 }}>
              Skip for now
            </Text>
            <Ionicons name="arrow-forward" size={16} color={color.navy.deep} />
          </Pressable>
        </View>
      }
    >
      <Text
        className="font-display-bold text-navy-deep text-center mt-8"
        style={{ fontSize: 30, lineHeight: 38 }}
      >
        How do you want us to greet you?
      </Text>
      <Text className="font-sans text-body text-navy/60 text-center mt-3">
        Make it feel like home.
      </Text>

      <View className="mt-8">
        <ValidatedField
          label="Preferred name"
          value={preferredName}
          onChangeText={(t) => set({ preferredName: t })}
          placeholder="e.g., Joe, Kwame, Ama, Alex"
          valid={nameValid}
        />
      </View>

      <View className="mt-6">
        <ValidatedField
          label="How should we greet you?"
          value={greeting}
          onChangeText={(t) => set({ greeting: t })}
          placeholder="e.g., Akwaaba, Karibu, Namaste, Habari…"
          valid={greetingValid}
        />
      </View>
      <Text className="font-sans text-caption text-navy/45 mt-2.5" style={{ lineHeight: 18 }}>
        Type in any language — this is how we'll welcome you every time you log in.
      </Text>

      <View className="rounded-card mt-7 px-5 py-5" style={{ backgroundColor: '#FDEBD6' }}>
        <Text className="font-sans-semibold tracking-wider text-navy/45" style={{ fontSize: 11 }}>
          PREVIEW
        </Text>
        <Text
          className="font-display-bold mt-2"
          style={{ fontSize: 22, color: ready ? color.navy.deep : '#BCAB9A' }}
        >
          {ready ? `${greeting.trim()}, ${preferredName.trim()}` : 'Your greeting will appear here'}
        </Text>
      </View>
    </KeyboardAwareScreen>
  );
}

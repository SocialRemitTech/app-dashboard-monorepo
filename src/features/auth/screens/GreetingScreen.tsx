// apps/mobile/src/features/auth/screens/GreetingScreen.tsx
import { View, Text, Pressable } from 'react-native';
import { Screen } from '@/shared/ui/Screen';
import { Button } from '@/shared/ui/Button';
import { TextField } from '@/shared/ui/TextField';
import { useOnboarding } from '@/features/auth/stores/onboarding.store';
import { useSession } from '@/features/auth/stores/session.store';

export function GreetingScreen() {
  const { preferredName, greeting, tokens, set, reset } = useOnboarding();
  const signIn = useSession((s) => s.signIn);

  const finish = async () => {
    // Apply the session captured at OTP verify, then leave the onboarding stack.
    if (tokens) {
      await signIn({ accessToken: tokens.accessToken, refreshToken: tokens.refreshToken, userId: 'me' });
    }
    reset();
    // The (app) guard takes over from here.
  };

  return (
    <Screen>
      <View className="mt-16 items-center gap-2">
        <Text className="font-display-bold text-navy-deep text-center" style={{ fontSize: 26 }}>
          How do you want{'\n'}us to greet you?
        </Text>
        <Text className="font-sans text-body text-navy/50">Make it feel like home.</Text>
      </View>

      <View className="mt-10 gap-6">
        <TextField
          label="Preferred Name"
          value={preferredName}
          onChangeText={(t) => set({ preferredName: t })}
          placeholder="e.g. Joe, Kwame, Ama, Alex"
        />
        <TextField
          label="How should we greet you?"
          value={greeting}
          onChangeText={(t) => set({ greeting: t })}
          placeholder="e.g. Akwaaba, Karibu, Namaste, Habari…"
        />
      </View>

      <View className="flex-1" />
      <View className="pb-6 gap-3">
        <Button label="Continue" onPress={finish} />
        <Pressable onPress={finish} className="items-center">
          <Text className="font-sans-semibold text-body text-navy/70">Skip for now</Text>
        </Pressable>
      </View>
    </Screen>
  );
}

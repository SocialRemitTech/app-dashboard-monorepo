// apps/mobile/src/features/auth/screens/GreetingScreen.tsx
import { View, Text, Pressable, ScrollView } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Screen } from '@/shared/ui/Screen';
import { Button } from '@/shared/ui/Button';
import { TextField } from '@/shared/ui/TextField';
import { color } from '@sr/design-tokens';
import { useOnboarding } from '@/features/auth/stores/onboarding.store';
import { useSession } from '@/features/auth/stores/session.store';

export function GreetingScreen() {
  const { preferredName, greeting, tokens, set, reset } = useOnboarding();
  const signIn = useSession((s) => s.signIn);

  const finish = async () => {
    if (tokens) {
      await signIn({
        accessToken: tokens.accessToken,
        refreshToken: tokens.refreshToken,
        userId: 'me',
      });
    }
    reset();
    // First-run funnel: straight into the send flow, now inside the authenticated shell.
    router.replace('/(app)/send/destination');
  };

  const showPreview = greeting.trim().length > 0 || preferredName.trim().length > 0;
  const previewText = `${greeting.trim() || 'Welcome'}, ${preferredName.trim() || 'friend'}`;

  return (
    <Screen>
      <ScrollView
        showsVerticalScrollIndicator={false}
        className="flex-1"
        keyboardShouldPersistTaps="handled"
      >
        <View className="mt-14 items-center gap-2">
          <Text
            className="font-display-bold text-navy-deep text-center"
            style={{ fontSize: 28, lineHeight: 34 }}
          >
            How do you want{'\n'}us to greet you?
          </Text>
          <Text className="font-sans text-body text-navy/50">Make it feel like home.</Text>
        </View>

        <View className="mt-8 gap-6">
          <TextField
            label="Preferred name"
            value={preferredName}
            onChangeText={(t) => set({ preferredName: t })}
            placeholder="e.g. Joe, Kwame, Ama, Alex"
          />
          <View className="gap-2">
            <TextField
              label="How should we greet you?"
              value={greeting}
              onChangeText={(t) => set({ greeting: t })}
              placeholder="e.g. Akwaaba, Karibu, Namaste, Habari…"
            />
            <Text className="font-sans text-caption text-navy/45">
              Type in any language — this is how we’ll welcome you every time you log in.
            </Text>
          </View>
        </View>

        {showPreview ? (
          <View
            className="rounded-card px-5 py-4 mt-6"
            style={{ backgroundColor: color.coral.softer + '55' }}
          >
            <Text className="font-sans-semibold text-caption tracking-widest text-navy/45">
              PREVIEW
            </Text>
            <Text className="font-display-bold text-navy-deep mt-1" style={{ fontSize: 24 }}>
              {previewText}
            </Text>
          </View>
        ) : null}
      </ScrollView>

      <View className="pb-6 gap-3">
        <Button label="Continue" onPress={finish} />
        <Pressable onPress={finish} className="flex-row items-center justify-center gap-2">
          <Text className="font-sans-semibold text-body text-navy/70">Skip for now</Text>
          <Ionicons name="arrow-forward" size={16} color={color.navy.DEFAULT} />
        </Pressable>
      </View>
    </Screen>
  );
}

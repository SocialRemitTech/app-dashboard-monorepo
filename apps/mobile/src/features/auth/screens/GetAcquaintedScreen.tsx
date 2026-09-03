// apps/mobile/src/features/auth/screens/GetAcquaintedScreen.tsx
import { useRef } from 'react';
import { View, Text, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Screen } from '@/shared/ui/Screen';
import { useOnboarding } from '@/features/auth/stores/onboarding.store';
import { useProfile } from '@/features/profile/stores/profile.store';
import { useSession } from '@/features/auth/stores/session.store';
import { color } from '@sr/design-tokens';

const ACTIONS: { icon: keyof typeof Ionicons.glyphMap; title: string; sub: string }[] = [
  { icon: 'paper-plane-outline', title: 'Send Money', sub: 'Send money home quickly' },
  { icon: 'trending-up-outline', title: 'Check Rates', sub: "See today's exchange rates" },
  {
    icon: 'phone-portrait-outline',
    title: 'Airtime & Data',
    sub: 'Top up airtime and data instantly',
  },
];

/**
 * Post-onboarding landing. Completing sign-in flips session status and the (auth) guard
 * navigates — this screen never calls router.replace itself (double-nav caused the loop).
 */
export function GetAcquaintedScreen() {
  const { tokens, reset } = useOnboarding();
  const { preferredName, greeting } = useProfile();
  const signIn = useSession((s) => s.signIn);
  const done = useRef(false);

  const hello =
    greeting && preferredName
      ? `${greeting}, ${preferredName}`
      : preferredName
        ? `Welcome, ${preferredName}`
        : 'Welcome';

  const enter = async () => {
    if (done.current) return;
    done.current = true;
    await signIn({
      accessToken: tokens?.accessToken ?? 'dev.access',
      refreshToken: tokens?.refreshToken ?? 'dev.refresh',
      userId: 'me',
    });
    reset();
  };

  return (
    <Screen>
      <View className="pt-2 flex-row items-center justify-between">
        <Pressable
          onPress={() => router.back()}
          className="h-11 w-11 rounded-pill bg-white border border-border/60 items-center justify-center"
        >
          <Ionicons name="arrow-back" size={20} color={color.navy.deep} />
        </Pressable>
        <Text className="font-sans text-body text-navy/55">Need help?</Text>
      </View>

      <Text className="font-display-bold text-navy-deep mt-6" style={{ fontSize: 30 }}>
        {hello}
      </Text>
      <Text className="font-sans text-body text-navy/55 mt-1">
        What would you like to do today?
      </Text>

      <View className="mt-6 gap-4">
        {ACTIONS.map((a) => (
          <Pressable
            key={a.title}
            onPress={() => void enter()}
            className="rounded-card bg-white border border-border/60 px-4 py-4 flex-row items-center gap-3"
          >
            <View
              className="h-12 w-12 rounded-input items-center justify-center"
              style={{ backgroundColor: 'rgba(255,90,42,0.08)' }}
            >
              <Ionicons name={a.icon} size={24} color={color.coral.DEFAULT} />
            </View>
            <View className="flex-1">
              <Text className="font-sans-bold text-base text-navy-deep">{a.title}</Text>
              <Text className="font-sans text-caption text-navy/50">{a.sub}</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color={color.grey.light} />
          </Pressable>
        ))}
      </View>

      <Text className="font-sans text-body text-navy/50 text-center mt-8">
        However you support home, we're here for you.
      </Text>
      <Pressable
        onPress={() => void enter()}
        className="items-center py-4 flex-row justify-center gap-1.5"
      >
        <Text className="font-sans-semibold text-coral" style={{ fontSize: 16 }}>
          Go to dashboard
        </Text>
        <Ionicons name="arrow-forward" size={16} color={color.coral.DEFAULT} />
      </Pressable>
    </Screen>
  );
}

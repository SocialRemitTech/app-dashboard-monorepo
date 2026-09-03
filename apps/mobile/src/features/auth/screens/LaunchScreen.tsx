// apps/mobile/src/features/auth/screens/LaunchScreen.tsx
import { useEffect, useRef } from 'react';
import { View, Text, Pressable, Animated, Easing, Dimensions } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Logo } from '@/shared/ui/Logo';
import { Button } from '@/shared/ui/Button';
import { color } from '@sr/design-tokens';

const { height: H } = Dimensions.get('window');

export function LaunchScreen() {
  const insets = useSafeAreaInsets();
  const fade = useRef(new Animated.Value(0)).current; // initial logo fade-in
  const morph = useRef(new Animated.Value(0)).current; // splash → welcome

  useEffect(() => {
    Animated.timing(fade, { toValue: 1, duration: 500, useNativeDriver: true }).start();
    const t = setTimeout(() => {
      Animated.timing(morph, {
        toValue: 1,
        duration: 850,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }).start();
    }, 1700);
    return () => clearTimeout(t);
  }, [fade, morph]);

  // Logo travels from vertical centre to just below the top inset, shrinking slightly.
  const logoTranslate = morph.interpolate({ inputRange: [0, 1], outputRange: [H * 0.34, 0] });
  const logoScale = morph.interpolate({ inputRange: [0, 1], outputRange: [1.12, 1] });
  // Welcome content fades/slides in during the second half of the morph.
  const contentOpacity = morph.interpolate({ inputRange: [0, 0.45, 1], outputRange: [0, 0, 1] });
  const contentTranslate = morph.interpolate({ inputRange: [0, 1], outputRange: [26, 0] });

  return (
    <View className="flex-1" style={{ backgroundColor: color.cream }}>
      {/* Logo */}
      <Animated.View
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          top: insets.top + 24,
          alignItems: 'center',
          opacity: fade,
          transform: [{ translateY: logoTranslate }, { scale: logoScale }],
        }}
      >
        <Logo width={210} variant="lockup-coral" />
      </Animated.View>

      {/* Welcome content */}
      <Animated.View
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          bottom: 0,
          paddingHorizontal: 20,
          paddingBottom: insets.bottom + 20,
          opacity: contentOpacity,
          transform: [{ translateY: contentTranslate }],
        }}
      >
        <View className="items-center mb-7">
          <Text
            className="font-display-bold text-navy-deep"
            style={{ fontSize: 34, lineHeight: 40 }}
          >
            Send. Save. <Text style={{ color: color.coral.DEFAULT }}>Build.</Text>
          </Text>
          <Text className="font-sans text-body text-navy/55 text-center mt-2 px-4">
            One app to send money home, save together, and build your future.
          </Text>
        </View>

        <Button label="Create Account" onPress={() => router.push('/(auth)/signup')} />
        <Text className="text-center font-sans-medium text-caption text-grey-mid mt-3">
          UK-registered · Bank-grade security
        </Text>
        <View className="mt-3">
          <Button label="Log in" variant="outline" onPress={() => router.push('/(auth)/login')} />
        </View>

        <View className="flex-row items-center gap-3 my-5">
          <View className="flex-1 h-px bg-border" />
          <Text className="font-sans-semibold text-caption text-grey-light">Or continue with</Text>
          <View className="flex-1 h-px bg-border" />
        </View>

        <View className="flex-row gap-3">
          <Social icon="logo-apple" onPress={() => router.push('/(auth)/signup')} />
          <Social icon="logo-google" onPress={() => router.push('/(auth)/signup')} />
        </View>
      </Animated.View>
    </View>
  );
}

function Social({ icon, onPress }: { icon: 'logo-apple' | 'logo-google'; onPress: () => void }) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      className="flex-1 h-14 rounded-button items-center justify-center bg-white border border-border-form"
    >
      <Ionicons name={icon} size={24} color={color.navy.DEFAULT} />
    </Pressable>
  );
}

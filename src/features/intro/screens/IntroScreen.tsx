// apps/mobile/src/features/intro/screens/IntroScreen.tsx
import { useState } from 'react';
import { View, Text, Pressable } from 'react-native';
import { router } from 'expo-router';
import Animated, { FadeIn } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';
import { IntroCarousel } from '@/features/intro/IntroCarousel';
import { color } from '@sr/design-tokens';

export function IntroScreen() {
  const [index, setIndex] = useState(0);
  const start = () => router.replace('/(auth)/get-acquainted');

  return (
    <View style={{ flex: 1, backgroundColor: color.coral.DEFAULT }}>
      <IntroCarousel onIndexChange={setIndex} />

      {/* Skip (top-right) */}
      <SafeAreaView edges={['top']} style={{ position: 'absolute', top: 0, right: 0 }}>
        <Pressable onPress={start} hitSlop={12} style={{ padding: 16 }}>
          <Text className="font-sans-semibold text-body text-white/90">Skip</Text>
        </Pressable>
      </SafeAreaView>

      {/* Bottom CTA */}
      <SafeAreaView
        edges={['bottom']}
        style={{ position: 'absolute', bottom: 0, left: 0, right: 0 }}
      >
        <Animated.View
          entering={FadeIn.duration(500)}
          style={{ paddingHorizontal: 20, paddingBottom: 24 }}
        >
          <Pressable
            onPress={start}
            className="h-14 rounded-button items-center justify-center bg-white"
            accessibilityRole="button"
          >
            <Text className="font-sans-semibold text-base text-coral">Get Started</Text>
          </Pressable>
        </Animated.View>
      </SafeAreaView>
    </View>
  );
}

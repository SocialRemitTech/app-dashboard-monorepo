// apps/mobile/src/features/kyc/screens/VerifyingScreen.tsx
import { useEffect, useRef } from 'react';
import { View, Text, Animated, Easing } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Screen } from '@/shared/ui/Screen';
import { Button } from '@/shared/ui/Button';
import { ContactSupportFooter } from '@/shared/ui/ContactSupportFooter';
import { color } from '@sr/design-tokens';

/** Submitted — verification is in review. Mirrors the "verification_in_progress" state. */
export function VerifyingScreen() {
  const spin = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.timing(spin, {
        toValue: 1,
        duration: 1000,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
    );
    loop.start();
    return () => loop.stop();
  }, [spin]);

  const rotate = spin.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '360deg'] });

  return (
    <Screen>
      <View className="flex-1 items-center justify-center">
        <View style={{ width: 120, height: 120, alignItems: 'center', justifyContent: 'center' }}>
          <Animated.View
            style={{
              position: 'absolute',
              width: 120,
              height: 120,
              borderRadius: 60,
              borderWidth: 4,
              borderColor: '#F0EBE3',
              borderTopColor: color.coral.DEFAULT,
              transform: [{ rotate }],
            }}
          />
          <Ionicons name="shield-checkmark-outline" size={46} color={color.coral.DEFAULT} />
        </View>

        <Text
          className="font-display-bold text-navy-deep text-center mt-8"
          style={{ fontSize: 29, lineHeight: 36 }}
        >
          We're checking your details
        </Text>
        <Text
          className="font-sans text-center mt-3 px-4"
          style={{ fontSize: 16, lineHeight: 24, color: '#9CA3AF' }}
        >
          This usually takes a few minutes. We'll notify you as soon as it's done — you can keep
          using the app in the meantime.
        </Text>
      </View>

      <ContactSupportFooter />
      <View className="pb-4">
        <Button
          label="Back to account"
          onPress={() => router.replace('/(app)/account/personal-details' as never)}
        />
      </View>
    </Screen>
  );
}

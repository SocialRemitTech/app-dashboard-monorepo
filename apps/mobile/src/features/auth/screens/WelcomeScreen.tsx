// apps/mobile/src/features/auth/screens/WelcomeScreen.tsx
import { View, Text, Pressable, ImageBackground } from 'react-native';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { images } from '@/shared/assets';
import { color } from '@sr/design-tokens';

const NAVY = '#0E1B2E';

/** Full-bleed lifestyle photo, coral wordmark, navy gradient footer with the two CTAs. */
export function WelcomeScreen() {
  return (
    <ImageBackground
      source={images.welcomePhoto}
      resizeMode="cover"
      style={{ flex: 1, width: '100%', backgroundColor: NAVY }}
    >
      <LinearGradient
        colors={[
          'rgba(14,27,46,0.22)',
          'rgba(14,27,46,0)',
          'rgba(14,27,46,0)',
          'rgba(14,27,46,0.9)',
          NAVY,
        ]}
        locations={[0, 0.16, 0.5, 0.82, 0.98]}
        style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}
      />
      <SafeAreaView className="flex-1" edges={['top', 'bottom']}>
        <Text
          className="text-center font-bold mt-8"
          style={{ fontSize: 40, color: color.coral.DEFAULT, letterSpacing: 0.1 }}
        >
          Social Remit
        </Text>

        <View className="flex-1" />

        <View className="px-5 pb-2 gap-3">
          <Pressable
            onPress={() => router.push('/(auth)/signup')}
            className="h-16 rounded-full items-center justify-center"
            style={{ backgroundColor: color.coral.DEFAULT }}
          >
            <Text className="font-semibold text-xl text-white">Create account</Text>
          </Pressable>
          <Pressable
            onPress={() => router.push('/(auth)/login')}
            className="h-16 rounded-full items-center justify-center bg-white"
          >
            <Text className="font-bold  text-xl" style={{ color: NAVY }}>
              Log in
            </Text>
          </Pressable>
        </View>
      </SafeAreaView>
    </ImageBackground>
  );
}

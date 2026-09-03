// apps/mobile/src/features/auth/screens/JoinFamilyScreen.tsx
import { View, Text, Pressable } from 'react-native';
import { router } from 'expo-router';
import { Screen } from '@/shared/ui/Screen';
import { BackButton } from '@/shared/ui/BackButton';
import { Button } from '@/shared/ui/Button';
import { TextField } from '@/shared/ui/TextField';
import { useOnboarding } from '@/features/auth/stores/onboarding.store';
import { useStartOtp } from '@/features/auth/api/auth.api';

export function JoinFamilyScreen() {
  const { countryCode, country, phone, set } = useOnboarding();
  const startOtp = useStartOtp();
  const valid = phone.replace(/\D/g, '').length >= 7;

  const onContinue = () => {
    startOtp.mutate(
      { channel: 'phone', value: `${countryCode}${phone}` },
      { onSuccess: () => router.push('/(auth)/otp') },
    );
  };

  return (
    <Screen>
      <View className="pt-2">
        <BackButton />
      </View>

      <Text className="font-display-bold text-coral mt-8" style={{ fontSize: 56, lineHeight: 58 }}>
        Join{'\n'}The{'\n'}Family
      </Text>
      <View className="h-px bg-border my-4" />
      <Text className="font-sans text-body text-navy/60">Tell us who you are.</Text>

      <View className="mt-8 gap-2">
        <Text className="font-sans-semibold text-label text-navy-deep">Mobile Number</Text>
        <View className="flex-row gap-3">
          <Pressable className="h-14 px-4 rounded-input bg-white border-2 border-border flex-row items-center gap-2">
            <Text className="text-lg">🇬🇧</Text>
            <Text className="font-sans-medium text-base text-navy">{countryCode}</Text>
          </Pressable>
          <View className="flex-1">
            <TextField
              value={phone}
              onChangeText={(t) => set({ phone: t })}
              placeholder="Phone number"
              keyboardType="phone-pad"
            />
          </View>
        </View>
        <Text className="font-sans text-caption text-navy/50 mt-1">
          So we know it’s really you. We’ll send a code to confirm.
        </Text>
      </View>

      <View className="mt-8">
        <Button
          label={startOtp.isPending ? 'Sending…' : 'Continue'}
          onPress={onContinue}
          disabled={!valid || startOtp.isPending}
        />
      </View>
    </Screen>
  );
}

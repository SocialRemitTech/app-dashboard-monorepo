// apps/mobile/src/features/auth/screens/NewPasscodeScreen.tsx
import { useEffect, useState } from 'react';
import { View, Text, Pressable, ScrollView } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Screen } from '@/shared/ui/Screen';
import { PasscodeKeypad } from '@/shared/ui/PasscodeKeypad';
import { usePasscode, PIN_LENGTH } from '@/features/auth/stores/passcode.store';
import { color } from '@sr/design-tokens';

type Stage = 'create' | 'confirm';

export function NewPasscodeScreen() {
  const setCode = usePasscode((s) => s.setCode);
  const [stage, setStage] = useState<Stage>('create');
  const [first, setFirst] = useState('');
  const [pin, setPin] = useState('');
  const [hidden, setHidden] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (pin.length !== PIN_LENGTH) return;
    if (stage === 'create') {
      setFirst(pin);
      setPin('');
      setError(null);
      setStage('confirm');
      return;
    }
    if (pin === first) {
      setCode(pin);
      router.replace('/(auth)/passcode-reset-success' as never);
    } else {
      setError("Those didn't match. Start again.");
      setPin('');
      setFirst('');
      setStage('create');
    }
  }, [pin]);

  const press = (d: string) => {
    setError(null);
    setPin((p) => (p.length < PIN_LENGTH ? p + d : p));
  };
  const back = () => setPin((p) => p.slice(0, -1));

  return (
    <Screen>
      {/* Scrollable: header + boxes + hint + 4 keypad rows overflow shorter devices,
          which was clipping the bottom row (the 0 / backspace). */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 24 }}
      >
        <View className="pt-2 flex-row items-center justify-between">
          <Pressable
            onPress={() => router.back()}
            className="h-11 w-11 rounded-pill bg-white border border-border/60 items-center justify-center"
          >
            <Ionicons name="arrow-back" size={20} color={color.navy.deep} />
          </Pressable>
          <View
            className="rounded-card items-center justify-center"
            style={{ width: 56, height: 56, backgroundColor: color.coral.DEFAULT }}
          >
            <Ionicons name="lock-closed" size={26} color={color.white} />
          </View>
          <Text className="font-sans-semibold text-navy-deep" style={{ fontSize: 15 }}>
            Get help
          </Text>
        </View>

        <Text
          className="font-display-bold text-navy-deep text-center mt-5"
          style={{ fontSize: 29, lineHeight: 36 }}
        >
          {stage === 'create'
            ? `Create your new ${PIN_LENGTH}-digit passcode`
            : 'Re-enter your new passcode'}
        </Text>
        <Text className="font-sans text-center text-navy/55 mt-2" style={{ fontSize: 15 }}>
          {stage === 'create'
            ? 'Use it to sign in and approve sensitive actions.'
            : 'Enter it once more to confirm.'}
        </Text>

        <View className="flex-row justify-between mt-6" style={{ paddingHorizontal: 4 }}>
          {Array.from({ length: PIN_LENGTH }).map((_, i) => {
            const active = i === pin.length;
            const filled = i < pin.length;
            return (
              <View
                key={i}
                className="rounded-input bg-white items-center justify-center"
                style={{
                  width: 56,
                  height: 60,
                  borderWidth: 2,
                  borderColor: active ? color.coral.DEFAULT : color.border.DEFAULT,
                }}
              >
                {filled ? (
                  hidden ? (
                    <View
                      style={{
                        width: 12,
                        height: 12,
                        borderRadius: 6,
                        backgroundColor: color.navy.deep,
                      }}
                    />
                  ) : (
                    <Text className="font-display-bold text-navy-deep" style={{ fontSize: 25 }}>
                      {pin[i]}
                    </Text>
                  )
                ) : active ? (
                  <View style={{ width: 2, height: 24, backgroundColor: color.navy.deep }} />
                ) : null}
              </View>
            );
          })}
        </View>

        <Pressable
          onPress={() => setHidden((h) => !h)}
          className="flex-row items-center justify-center gap-2 mt-4"
        >
          <Ionicons
            name={hidden ? 'eye-outline' : 'eye-off-outline'}
            size={18}
            color={color.coral.DEFAULT}
          />
          <Text className="font-sans-medium text-navy-deep" style={{ fontSize: 15 }}>
            {hidden ? 'Show passcode' : 'Hide passcode'}
          </Text>
        </Pressable>

        <View
          className="rounded-card mt-4 px-5 py-3.5"
          style={{ backgroundColor: 'rgba(255,90,42,0.06)' }}
        >
          <Text
            className="font-sans text-center text-navy/65"
            style={{ fontSize: 14, lineHeight: 20 }}
          >
            {error ?? "Choose a passcode you can remember, but others can't guess."}
          </Text>
        </View>

        <View className="mt-6">
          <PasscodeKeypad onDigit={press} onBackspace={back} />
        </View>
      </ScrollView>
    </Screen>
  );
}

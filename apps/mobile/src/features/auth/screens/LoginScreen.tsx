// apps/mobile/src/features/auth/screens/LoginScreen.tsx
import { useEffect, useRef, useState } from 'react';
import { View, Text, Pressable, Animated } from 'react-native';
import { router } from 'expo-router';
import { MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';
import { Screen } from '@/shared/ui/Screen';
import { PasscodeKeypad } from '@/shared/ui/PasscodeKeypad';
import { PasscodeDots } from '@/shared/ui/PasscodeDots';
import { biometrics } from '@/shared/platform/biometrics';
import { useSession } from '@/features/auth/stores/session.store';
import {
  usePasscode,
  PIN_LENGTH,
  WARN_FROM_ATTEMPT,
  attemptsLeft,
  isLockActive,
} from '@/features/auth/stores/passcode.store';
import { color } from '@sr/design-tokens';

const PEACH_TINT = 'rgba(255,90,42,0.10)';
const FACE_CIRCLE = 104; // measured from design
const CTA_WIDTH = 190; // buttons are inset, not full-bleed
const CTA_HEIGHT = 54;

export function LoginScreen() {
  const signIn = useSession((s) => s.signIn);
  const verify = usePasscode((s) => s.verify);
  const registerFailure = usePasscode((s) => s.registerFailure);
  const clearFailures = usePasscode((s) => s.clearFailures);
  const lockedUntil = usePasscode((s) => s.lockedUntil);
  const failedAttempts = usePasscode((s) => s.failedAttempts);

  const [mode, setMode] = useState<'biometric' | 'passcode'>('biometric');
  const [pin, setPin] = useState('');
  const [error, setError] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);
  const done = useRef(false);
  const navigated = useRef(false);
  const shake = useRef(new Animated.Value(0)).current;

  const locked = isLockActive(lockedUntil);

  const goPaused = () => {
    if (navigated.current) return;
    navigated.current = true;
    router.replace('/(auth)/sign-in-paused' as never);
  };

  useEffect(() => {
    if (locked) {
      goPaused();
      return;
    }
    if (lockedUntil && !locked) clearFailures();
  }, []);

  const enter = async () => {
    if (done.current) return;
    done.current = true;
    clearFailures();
    await signIn({ accessToken: 'dev.access', refreshToken: 'dev.refresh', userId: 'me' });
  };

  const tryBiometric = async () => {
    if (done.current || locked) return;
    setNotice(null);
    const available = await biometrics.isAvailable();
    if (!available) {
      setNotice('Face ID isn’t set up on this device. Use your passcode.');
      return;
    }
    const ok = await biometrics.authenticate('Unlock Social Remit');
    if (ok) void enter();
    else setNotice('Face ID not recognised. Try again or use your passcode.');
  };

  const runShake = () => {
    shake.setValue(0);
    Animated.sequence([
      Animated.timing(shake, { toValue: 1, duration: 60, useNativeDriver: true }),
      Animated.timing(shake, { toValue: -1, duration: 60, useNativeDriver: true }),
      Animated.timing(shake, { toValue: 1, duration: 60, useNativeDriver: true }),
      Animated.timing(shake, { toValue: 0, duration: 60, useNativeDriver: true }),
    ]).start();
  };

  useEffect(() => {
    if (pin.length !== PIN_LENGTH) return;
    if (verify(pin)) {
      void enter();
      return;
    }
    const { attempts, locked: nowLocked } = registerFailure();
    setError(true);
    runShake();
    const t = setTimeout(() => {
      setPin('');
      setError(false);
      if (nowLocked) {
        goPaused();
        return;
      }
      const left = attemptsLeft(attempts);
      setNotice(
        attempts >= WARN_FROM_ATTEMPT
          ? `Incorrect passcode. ${left} ${left === 1 ? 'attempt' : 'attempts'} left before sign-in is paused.`
          : 'Incorrect passcode. Try again.',
      );
    }, 450);
    return () => clearTimeout(t);
  }, [pin]);

  const press = (d: string) => {
    if (locked) return;
    setNotice(null);
    setPin((p) => (p.length < PIN_LENGTH ? p + d : p));
  };
  const back = () => setPin((p) => p.slice(0, -1));
  const forgot = () => router.push('/(auth)/forgot-passcode' as never);

  if (locked)
    return (
      <Screen>
        <View className="flex-1" />
      </Screen>
    );

  if (mode === 'passcode') {
    const translateX = shake.interpolate({ inputRange: [-1, 1], outputRange: [-10, 10] });
    return (
      <Screen>
        <View className="flex-1 items-center pt-6">
          <View
            className="rounded-card items-center justify-center"
            style={{ width: 92, height: 92, backgroundColor: color.coral.DEFAULT }}
          >
            <Ionicons name="lock-closed" size={42} color={color.white} />
          </View>

          <Text className="font-display-bold text-navy-deep mt-6" style={{ fontSize: 32 }}>
            Welcome back
          </Text>
          <Text className="font-sans mt-2" style={{ fontSize: 17, color: '#9CA3AF' }}>
            Enter your {PIN_LENGTH}-digit passcode
          </Text>

          <Animated.View className="mt-10" style={{ transform: [{ translateX }] }}>
            <PasscodeDots length={PIN_LENGTH} filled={pin.length} error={error} />
          </Animated.View>

          {notice ? (
            <Text
              className="font-sans text-center mt-4 px-6"
              style={{
                fontSize: 14,
                color: failedAttempts >= WARN_FROM_ATTEMPT ? '#D64545' : '#9CA3AF',
              }}
            >
              {notice}
            </Text>
          ) : null}

          <View className="mt-14">
            <PasscodeKeypad
              onDigit={press}
              onBackspace={back}
              onBiometric={() => {
                setPin('');
                setNotice(null);
                setMode('biometric');
              }}
            />
          </View>

          <Pressable onPress={forgot} className="mt-7 py-2">
            <Text className="font-sans-semibold" style={{ fontSize: 16, color: color.navy.deep }}>
              Forgot passcode?
            </Text>
          </Pressable>
        </View>
      </Screen>
    );
  }

  /* Biometric view — one centred column; buttons follow the content and are inset,
     NOT pinned to the bottom edge. */
  return (
    <Screen>
      <View className="flex-1 items-center" style={{ justifyContent: 'center' }}>
        <Text className="font-sans text-center" style={{ fontSize: 18, color: '#9CA3AF' }}>
          Welcome back
        </Text>

        <Pressable
          onPress={tryBiometric}
          accessibilityRole="button"
          accessibilityLabel="Authenticate with Face ID"
          className="rounded-pill items-center justify-center"
          style={{
            width: FACE_CIRCLE,
            height: FACE_CIRCLE,
            backgroundColor: PEACH_TINT,
            marginTop: 46,
          }}
        >
          <MaterialCommunityIcons name="face-recognition" size={50} color={color.coral.DEFAULT} />
        </Pressable>

        <Text
          className="font-sans text-center"
          style={{ fontSize: 18, color: '#9CA3AF', marginTop: 40 }}
        >
          Touch to authenticate
        </Text>

        {notice ? (
          <Text
            className="font-sans text-center mt-3 px-8"
            style={{ fontSize: 13, color: '#D64545' }}
          >
            {notice}
          </Text>
        ) : null}

        <Pressable
          onPress={tryBiometric}
          className="rounded-button items-center justify-center"
          style={{
            width: CTA_WIDTH,
            height: CTA_HEIGHT,
            backgroundColor: color.coral.DEFAULT,
            marginTop: 34,
          }}
        >
          <Text className="font-sans-bold text-white" style={{ fontSize: 16 }}>
            Use Face ID
          </Text>
        </Pressable>

        <Pressable
          onPress={() => {
            setNotice(null);
            setMode('passcode');
          }}
          className="rounded-button items-center justify-center"
          style={{
            width: CTA_WIDTH,
            height: CTA_HEIGHT,
            backgroundColor: '#EEEDEB',
            marginTop: 16,
          }}
        >
          <Text className="font-sans-bold" style={{ fontSize: 16, color: color.navy.deep }}>
            Use passcode instead
          </Text>
        </Pressable>

        <Pressable onPress={forgot} className="mt-5 py-2">
          <Text className="font-sans-semibold" style={{ fontSize: 15, color: color.navy.deep }}>
            Forgot passcode?
          </Text>
        </Pressable>
      </View>
    </Screen>
  );
}

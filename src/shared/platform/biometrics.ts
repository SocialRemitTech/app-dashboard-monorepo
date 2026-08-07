import * as LocalAuthentication from 'expo-local-authentication';

/** Biometrics GATE the secure-store token — they never "compare a PIN". PIN is verified server-side. */
export const biometrics = {
  async isAvailable(): Promise<boolean> {
    const [hasHardware, isEnrolled] = await Promise.all([
      LocalAuthentication.hasHardwareAsync(),
      LocalAuthentication.isEnrolledAsync(),
    ]);
    return hasHardware && isEnrolled;
  },
  async authenticate(reason = 'Unlock EMONI'): Promise<boolean> {
    const result = await LocalAuthentication.authenticateAsync({
      promptMessage: reason,
      disableDeviceFallback: false,
    });
    return result.success;
  },
};

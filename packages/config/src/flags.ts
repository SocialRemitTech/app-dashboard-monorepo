/** Default flag values (remote provider overrides at runtime). Gate corridor rollout, features, A/B. */
export const defaultFlags = {
  'corridor.ghana': true,
  'corridor.nigeria': false,
  'corridor.kenya': false,
  'pay.openBanking': true,
  'pay.card': true,
  'pay.applePay': false,
  'wallet.enabled': false,
} as const;

export type FlagKey = keyof typeof defaultFlags;

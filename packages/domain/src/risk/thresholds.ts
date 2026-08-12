export const RISK = {
  verificationThresholdMinor: 90_000, // £900 — above this, force ID verification
  occupationThresholdMinor: 50_000, //  £500 — above this, ask occupation
  highRiskCorridors: ['NG', 'PK'], //   ISO country codes needing extra scrutiny
} as const;

export function requiresOccupation(sendAmountMinor: number, toCountry: string): boolean {
  return sendAmountMinor >= RISK.occupationThresholdMinor || RISK.highRiskCorridors.includes(toCountry as never);
}

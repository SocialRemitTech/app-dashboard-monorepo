import { RISK } from '../risk/thresholds';

export type KycStatus = 'not_started' | 'in_progress' | 'verified' | 'review' | 'rejected';

export type GateDecision =
  | { action: 'proceed' }
  | { action: 'require_kyc'; level: 'basic' | 'edd' }
  | { action: 'require_id_verification' };

/**
 * The SINGLE routing gate (Frontend §3.3 / MVP comments). Not new-vs-returning — purely: is this
 * customer cleared for this amount/corridor? Server remains source of truth; this is fast-feedback UX.
 */
export function evaluateKycGate(input: {
  kycStatus: KycStatus;
  sendAmountMinor: number;
  toCountry: string;
  requiredCorridorLevel: 'basic' | 'edd';
}): GateDecision {
  if (input.kycStatus === 'verified') return { action: 'proceed' };
  if (input.sendAmountMinor >= RISK.verificationThresholdMinor) {
    return { action: 'require_id_verification' };
  }
  return { action: 'require_kyc', level: input.requiredCorridorLevel };
}

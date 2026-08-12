import { describe, expect, it } from 'vitest';
import { evaluateKycGate } from './gate';

const base = { toCountry: 'GH', requiredCorridorLevel: 'basic' as const };

describe('KYC gate', () => {
  it('verified customers proceed', () => {
    expect(evaluateKycGate({ ...base, kycStatus: 'verified', sendAmountMinor: 500000 })).toEqual({ action: 'proceed' });
  });
  it('forces ID verification above £900', () => {
    expect(evaluateKycGate({ ...base, kycStatus: 'not_started', sendAmountMinor: 90000 }))
      .toEqual({ action: 'require_id_verification' });
  });
  it('requires basic KYC below threshold', () => {
    expect(evaluateKycGate({ ...base, kycStatus: 'not_started', sendAmountMinor: 5000 }))
      .toEqual({ action: 'require_kyc', level: 'basic' });
  });
});

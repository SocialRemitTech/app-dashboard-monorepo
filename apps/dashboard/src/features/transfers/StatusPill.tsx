// apps/dashboard/src/features/transfers/StatusPill.tsx
import type { CanonicalStatus } from '@sr/api-contract';

const MAP: Record<string, { label: string; bg: string; fg: string }> = {
  completed:        { label: 'Completed', bg: '#DCFCE7', fg: '#2E9E6F' },
  reconciled:       { label: 'Reconciled', bg: '#DCFCE7', fg: '#2E9E6F' },
  paid_on_partner:  { label: 'Paid (partner)', bg: '#E0F2FE', fg: '#0369A1' },
  processing:       { label: 'Processing', bg: '#FEF3C7', fg: '#B45309' },
  screening:        { label: 'Screening', bg: '#FEF3C7', fg: '#B45309' },
  payout_submitted: { label: 'Submitted', bg: '#E0F2FE', fg: '#0369A1' },
  failed:           { label: 'Failed', bg: '#FEE2E2', fg: '#DC2626' },
  rejected:         { label: 'Rejected', bg: '#FEE2E2', fg: '#DC2626' },
};

export function StatusPill({ status }: { status: CanonicalStatus }) {
  const s = MAP[status] ?? { label: status, bg: '#F3F4F6', fg: '#6B7280' };
  return (
    <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold"
      style={{ backgroundColor: s.bg, color: s.fg }}>
      {s.label}
    </span>
  );
}

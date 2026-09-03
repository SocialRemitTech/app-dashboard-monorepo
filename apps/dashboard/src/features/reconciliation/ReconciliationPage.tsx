// apps/dashboard/src/features/reconciliation/ReconciliationPage.tsx
import { DashboardLayout } from '@/app/layout/DashboardLayout';
import { Card } from '@/shared/ui/Card';
import { breaks } from '@/data/mock';

const LABEL: Record<string, string> = {
  partner_paid_no_record: 'Partner paid · no record',
  platform_paid_missing: 'Platform paid · partner missing',
  amount_mismatch: 'Amount mismatch',
  duplicate: 'Duplicate',
  stuck: 'Stuck (Paidx)',
};

export function ReconciliationPage() {
  return (
    <DashboardLayout title="Reconciliation">
      <div className="grid grid-cols-3 gap-4 mb-4">
        <Card><div className="text-xs text-[#9CA3AF]">Open breaks</div><div className="font-display font-extrabold text-2xl text-[#12233B] mt-1">{breaks.length}</div></Card>
        <Card><div className="text-xs text-[#9CA3AF]">Oldest</div><div className="font-display font-extrabold text-2xl text-[#12233B] mt-1">{Math.max(...breaks.map((b) => b.ageHours))}h</div></Card>
        <Card><div className="text-xs text-[#9CA3AF]">Partners affected</div><div className="font-display font-extrabold text-2xl text-[#12233B] mt-1">{new Set(breaks.map((b) => b.partner)).size}</div></Card>
      </div>

      <Card>
        <h3 className="font-display font-bold text-[#12233B] mb-1">Breaks queue</h3>
        <p className="text-sm text-[#9CA3AF] mb-4">Nothing settles to the ledger until matched against a partner statement line.</p>
        <table className="w-full text-sm">
          <thead className="text-[#9CA3AF] text-left">
            <tr><th className="font-medium py-2">Break</th><th className="font-medium">Transfer</th><th className="font-medium">Partner</th><th className="font-medium">Type</th><th className="font-medium">Amount</th><th className="font-medium">Age</th><th></th></tr>
          </thead>
          <tbody>
            {breaks.map((b) => (
              <tr key={b.id} className="border-t border-[#f3f3f3]">
                <td className="py-3 font-mono text-[#12233B]">{b.id}</td>
                <td className="font-mono text-[#374151]">{b.transferId}</td>
                <td className="text-[#6B7280]">{b.partner}</td>
                <td><span className="inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold" style={{ background: '#FEE2E2', color: '#DC2626' }}>{LABEL[b.type]}</span></td>
                <td className="text-[#12233B] font-semibold">{(b.amountMinor / 100).toLocaleString('en-GB', { minimumFractionDigits: 2 })} {b.ccy}</td>
                <td className="text-[#6B7280]">{b.ageHours}h</td>
                <td><button className="text-xs font-semibold text-[#FF5A2A]">Resolve</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </DashboardLayout>
  );
}

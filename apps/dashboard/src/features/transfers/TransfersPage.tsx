// apps/dashboard/src/features/transfers/TransfersPage.tsx
import { useMemo, useState } from 'react';
import { DashboardLayout } from '@/app/layout/DashboardLayout';
import { Card } from '@/shared/ui/Card';
import { StatusPill } from './StatusPill';
import { transfers } from '@/data/mock';

const FILTERS = ['all', 'processing', 'completed', 'failed'] as const;
const gbp = (m: number) => `£${(m / 100).toLocaleString('en-GB')}`;
const fmt = (m: number, ccy: string) => `${(m / 100).toLocaleString('en-GB', { minimumFractionDigits: 2 })} ${ccy}`;

export function TransfersPage() {
  const [filter, setFilter] = useState<(typeof FILTERS)[number]>('all');
  const [q, setQ] = useState('');
  const rows = useMemo(
    () => transfers.filter((t) =>
      (filter === 'all' || t.status === filter) &&
      (q === '' || t.id.toLowerCase().includes(q.toLowerCase()) || t.recipient.toLowerCase().includes(q.toLowerCase()))
    ),
    [filter, q],
  );

  return (
    <DashboardLayout title="Transfers">
      <Card>
        <div className="flex items-center justify-between mb-4">
          <div className="flex gap-2">
            {FILTERS.map((f) => (
              <button key={f} onClick={() => setFilter(f)}
                className={`px-3 py-1.5 rounded-full text-sm font-medium capitalize ${filter === f ? 'bg-[#FF5A2A] text-white' : 'bg-[#F3F4F6] text-[#6B7280]'}`}>
                {f}
              </button>
            ))}
          </div>
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Filter…"
            className="text-sm border border-[#eee] rounded-full px-4 py-2 w-56 outline-none" />
        </div>

        <table className="w-full text-sm">
          <thead className="text-[#9CA3AF] text-left">
            <tr>
              <th className="font-medium py-2">ID</th><th className="font-medium">Date</th><th className="font-medium">Recipient</th>
              <th className="font-medium">Corridor</th><th className="font-medium">You send</th><th className="font-medium">Receives</th>
              <th className="font-medium">Partner</th><th className="font-medium">Status</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((t) => (
              <tr key={t.id} className="border-t border-[#f3f3f3] hover:bg-[#FEFBF5]">
                <td className="py-3 font-mono text-[#12233B]">{t.id}</td>
                <td className="text-[#6B7280]">{new Date(t.createdAt).toLocaleDateString('en-GB')}</td>
                <td className="text-[#374151]">{t.recipient}</td>
                <td className="text-[#6B7280]">{t.corridor}</td>
                <td className="text-[#12233B] font-semibold">{gbp(t.sendMinor)}</td>
                <td className="text-[#6B7280]">{fmt(t.receiveMinor, t.receiveCcy)}</td>
                <td className="text-[#6B7280]">{t.partner}</td>
                <td><StatusPill status={t.status} /></td>
              </tr>
            ))}
          </tbody>
        </table>
        {rows.length === 0 ? <div className="text-center text-[#9CA3AF] py-10 text-sm">No transfers match.</div> : null}
      </Card>
    </DashboardLayout>
  );
}

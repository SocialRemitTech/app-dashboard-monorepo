// apps/dashboard/src/features/overview/OverviewPage.tsx
import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import { DashboardLayout } from '@/app/layout/DashboardLayout';
import { StatusPill } from '@/features/transfers/StatusPill';
import { useCorridors } from '@/features/corridors/corridors.store';
import { transfers, breaks } from '@/data/mock';

const gbp0 = (m: number) => (m / 100).toLocaleString('en-GB', { maximumFractionDigits: 0 });
const gbp = (m: number) => `£${gbp0(m)}`;

export function OverviewPage() {
  const corridors = useCorridors((s) => s.corridors);
  const live = corridors.filter((c) => c.live);
  const totalVolume = transfers.reduce((a, t) => a + t.sendMinor, 0);
  const today = transfers.filter((t) => Date.now() - +new Date(t.createdAt) < 864e5).length;
  const pending = transfers.filter((t) => ['processing', 'screening', 'payout_submitted', 'paid_on_partner'].includes(t.status)).length;

  return (
    <DashboardLayout title="Overview" sub="Money movement across live corridors, in real time.">
      {/* Composed hero band — one figure done well, secondary stats folded in */}
      <div className="rounded-3xl p-8 text-white relative overflow-hidden"
        style={{ background: 'linear-gradient(120deg,#12233B 0%,#1B365D 60%,#243F63 100%)' }}>
        <div className="text-[11px] tracking-[0.2em] text-white/45 uppercase">Volume · last 30 days</div>
        <div className="font-display font-extrabold tnum leading-none mt-2" style={{ fontSize: 56 }}>
          £{gbp0(totalVolume)}
        </div>
        <div className="text-white/60 mt-2">
          across <span className="text-white font-semibold">{live.length}</span> live corridors ·{' '}
          <span className="text-[#FF9E7D]">{today}</span> transfers today
        </div>

        <div className="flex gap-10 mt-8">
          <HeroStat label="Pending payout" value={String(pending)} />
          <HeroStat label="Recon breaks" value={String(breaks.length)} accent={breaks.length > 0} />
          <HeroStat label="Avg. delivery" value="2m 40s" />
        </div>
      </div>

      {/* Live corridors strip */}
      <div className="flex items-center justify-between mt-8 mb-3">
        <h3 className="font-display font-bold text-[#12233B]">Live corridors</h3>
        <Link to="/corridors" className="text-sm font-semibold text-[#FF5A2A] flex items-center gap-1">Manage <ArrowUpRight size={14} /></Link>
      </div>
      <div className="flex gap-3 flex-wrap">
        {live.map((c) => (
          <div key={c.code} className="rounded-2xl bg-white border border-[#ECE5D8] px-4 py-3 flex items-center gap-3">
            <span className="text-xl">{c.flag}</span>
            <div>
              <div className="text-sm font-semibold text-[#12233B]">{c.country}</div>
              <div className="text-xs tnum text-[#8A8578]">£1 = {c.rate.toLocaleString('en-GB', { minimumFractionDigits: 2 })} {c.receiveCurrency}</div>
            </div>
            <span className="h-2 w-2 rounded-full bg-[#FF5A2A] pulse ml-1" />
          </div>
        ))}
      </div>

      {/* Recent transfers — hairline table, mono IDs, tabular figures */}
      <div className="flex items-center justify-between mt-9 mb-3">
        <h3 className="font-display font-bold text-[#12233B]">Recent transfers</h3>
        <Link to="/transfers" className="text-sm font-semibold text-[#FF5A2A]">View all</Link>
      </div>
      <div className="rounded-2xl bg-white border border-[#ECE5D8] overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-[11px] uppercase tracking-wider text-[#B3AC9C]">
              <th className="font-semibold px-5 py-3">Transfer</th><th className="font-semibold">Recipient</th>
              <th className="font-semibold">Corridor</th><th className="font-semibold">Amount</th>
              <th className="font-semibold">Partner</th><th className="font-semibold">Status</th>
            </tr>
          </thead>
          <tbody>
            {transfers.slice(0, 7).map((t) => (
              <tr key={t.id} className="border-t border-[#F1ECE1]">
                <td className="px-5 py-3.5 font-mono text-[13px] text-[#12233B]">{t.id}</td>
                <td className="text-[#374151]">{t.recipient}</td>
                <td className="text-[#8A8578]">{t.corridor}</td>
                <td className="tnum font-semibold text-[#12233B]">{gbp(t.sendMinor)}</td>
                <td className="text-[#8A8578]">{t.partner}</td>
                <td className="pr-5"><StatusPill status={t.status} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </DashboardLayout>
  );
}

function HeroStat({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  return (
    <div>
      <div className="font-display font-bold tnum text-3xl" style={{ color: accent ? '#FF9E7D' : '#fff' }}>{value}</div>
      <div className="text-xs text-white/45 mt-1">{label}</div>
    </div>
  );
}

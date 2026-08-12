// apps/dashboard/src/features/corridors/CorridorsPage.tsx
import { DashboardLayout } from '@/app/layout/DashboardLayout';
import { Toggle } from '@/shared/ui/Toggle';
import { useCorridors } from './corridors.store';

// Indicative weekly volume per live corridor (mock).
const VOL: Record<string, number> = { GH: 42600, NG: 28400 };

export function CorridorsPage() {
  const { corridors, setLive } = useCorridors();
  const live = corridors.filter((c) => c.live).length;
  const maxVol = Math.max(1, ...Object.values(VOL));

  return (
    <DashboardLayout title="Corridors" sub="Control which destinations senders can use in the app.">
      <div className="flex items-center gap-3 mb-5">
        <Badge tone="live">{live} live</Badge>
        <Badge tone="soon">{corridors.length - live} coming soon</Badge>
      </div>

      <div className="rounded-2xl bg-white border border-[#ECE5D8] overflow-hidden">
        {corridors.map((c, i) => (
          <div
            key={c.code}
            className={`flex items-center gap-4 px-5 py-4 ${i > 0 ? 'border-t border-[#F1ECE1]' : ''} ${c.live ? '' : 'opacity-70'}`}
          >
            <div className="text-2xl w-8 text-center">{c.flag}</div>

            <div className="w-44">
              <div className="font-semibold text-[#12233B]">{c.country}</div>
              <div className="text-xs text-[#8A8578]">via {c.partner}</div>
            </div>

            <div className="w-32 text-sm tnum text-[#374151]">
              £1 = {c.rate.toLocaleString('en-GB', { minimumFractionDigits: 2 })}{' '}
              {c.receiveCurrency}
            </div>

            {/* volume bar (live only) */}
            <div className="flex-1 min-w-0">
              {c.live ? (
                <div className="flex items-center gap-3">
                  <div className="h-2 rounded-full bg-[#F1ECE1] flex-1 max-w-[220px]">
                    <div
                      className="h-2 rounded-full bg-[#FF5A2A]"
                      style={{ width: `${((VOL[c.code] ?? 0) / maxVol) * 100}%` }}
                    />
                  </div>
                  <span className="text-xs tnum text-[#8A8578]">
                    £{(VOL[c.code] ?? 0).toLocaleString('en-GB')} / wk
                  </span>
                </div>
              ) : (
                <span className="text-xs text-[#B3AC9C]">No traffic yet</span>
              )}
            </div>

            {/* status */}
            <div className="w-28">
              {c.live ? (
                <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#2E9E6F]">
                  <span className="h-2 w-2 rounded-full bg-[#FF5A2A] pulse" /> Live
                </span>
              ) : (
                <span className="text-sm font-medium text-[#B3AC9C]">Coming soon</span>
              )}
            </div>

            <Toggle
              on={c.live}
              onChange={(v) => setLive(c.code, v)}
              label={`Make ${c.country} ${c.live ? 'coming soon' : 'live'}`}
            />
          </div>
        ))}
      </div>

      <p className="text-xs text-[#8A8578] mt-4">
        Flipping a corridor live makes it selectable for senders immediately. Rates and payout
        partners are managed per corridor.
      </p>
    </DashboardLayout>
  );
}

function Badge({ tone, children }: { tone: 'live' | 'soon'; children: React.ReactNode }) {
  const s =
    tone === 'live'
      ? { background: '#FFEDE7', color: '#FF5A2A' }
      : { background: '#F1ECE1', color: '#8A8578' };
  return (
    <span className="rounded-full px-3 py-1 text-xs font-semibold" style={s}>
      {children}
    </span>
  );
}

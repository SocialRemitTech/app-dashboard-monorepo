// apps/dashboard/src/app/layout/Sidebar.tsx
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, ArrowLeftRight, Scale, Globe2, ShieldCheck } from 'lucide-react';

const NAV = [
  { to: '/', label: 'Overview', icon: LayoutDashboard, end: true },
  { to: '/transfers', label: 'Transfers', icon: ArrowLeftRight },
  { to: '/reconciliation', label: 'Reconciliation', icon: Scale },
  { to: '/corridors', label: 'Corridors', icon: Globe2 },
  { to: '/compliance', label: 'Compliance', icon: ShieldCheck },
];

export function Sidebar() {
  return (
    <aside className="w-64 shrink-0 h-screen sticky top-0 flex flex-col text-white"
      style={{ background: 'linear-gradient(180deg,#12233B 0%,#0E1B2E 100%)' }}>
      <div className="px-6 py-6 flex items-center gap-3">
        <div className="h-9 w-9 rounded-xl flex items-center justify-center font-display font-extrabold" style={{ background: '#FF5A2A' }}>S</div>
        <div className="leading-tight">
          <div className="font-display font-bold">Social Remit</div>
          <div className="text-[11px] tracking-widest text-white/40 uppercase">Operations</div>
        </div>
      </div>
      <nav className="px-3 mt-2 flex-1">
        {NAV.map(({ to, label, icon: Icon, end }) => (
          <NavLink key={to} to={to} end={end}
            className={({ isActive }) =>
              `relative flex items-center gap-3 px-4 py-2.5 rounded-xl mb-1 text-sm font-medium transition-colors ${
                isActive ? 'text-white bg-white/[0.06]' : 'text-white/55 hover:text-white hover:bg-white/[0.04]'
              }`
            }>
            {({ isActive }) => (
              <>
                {isActive && <span className="absolute left-0 top-1/2 -translate-y-1/2 h-5 w-1 rounded-r bg-[#FF5A2A]" />}
                <Icon size={18} strokeWidth={2} /> {label}
              </>
            )}
          </NavLink>
        ))}
      </nav>
      <div className="mx-4 mb-4 rounded-xl bg-white/[0.04] px-4 py-3">
        <div className="text-[11px] text-white/40">Environment</div>
        <div className="text-sm font-medium">Development · mock data</div>
      </div>
    </aside>
  );
}

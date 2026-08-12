// apps/dashboard/src/app/layout/Topbar.tsx
import { Search } from 'lucide-react';
export function Topbar({ title, sub }: { title: string; sub?: string }) {
  return (
    <header className="flex items-end justify-between px-8 pt-8 pb-6">
      <div>
        <h1 className="font-display font-extrabold text-[28px] leading-none text-[#12233B]">
          {title}
        </h1>
        {sub ? <p className="text-sm text-[#8A8578] mt-1.5">{sub}</p> : null}
      </div>
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 text-xs text-[#8A8578]">
          <span className="h-2 w-2 rounded-full bg-[#2E9E6F] pulse" /> Live
        </div>
        <div className="flex items-center gap-2 bg-white border border-[#ECE5D8] rounded-full px-3 py-2 w-64">
          <Search size={15} className="text-[#B3AC9C]" />
          <input
            placeholder="Search transfer or user…"
            className="text-sm outline-none flex-1 bg-transparent tnum"
          />
        </div>
        <div className="h-9 w-9 rounded-full bg-[#12233B] text-white flex items-center justify-center font-semibold text-sm">
          OP
        </div>
      </div>
    </header>
  );
}

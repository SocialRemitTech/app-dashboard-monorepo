// apps/dashboard/src/app/layout/DashboardLayout.tsx
import type { ReactNode } from 'react';
import { Sidebar } from './Sidebar';
import { Topbar } from './Topbar';
export function DashboardLayout({
  title,
  sub,
  children,
}: {
  title: string;
  sub?: string;
  children: ReactNode;
}) {
  return (
    <div className="min-h-screen flex">
      <Sidebar />
      <main className="flex-1 min-w-0">
        <Topbar title={title} sub={sub} />
        <div className="px-8 pb-12">{children}</div>
      </main>
    </div>
  );
}

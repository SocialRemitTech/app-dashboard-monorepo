// apps/dashboard/src/App.tsx
import { Routes, Route } from 'react-router-dom';
import { OverviewPage } from '@/features/overview/OverviewPage';
import { TransfersPage } from '@/features/transfers/TransfersPage';
import { ReconciliationPage } from '@/features/reconciliation/ReconciliationPage';
import { CorridorsPage } from '@/features/corridors/CorridorsPage';
import { DashboardLayout } from '@/app/layout/DashboardLayout';

function Stub({ title }: { title: string }) {
  return <DashboardLayout title={title}><div className="text-[#8A8578]">Coming next.</div></DashboardLayout>;
}
export function App() {
  return (
    <Routes>
      <Route path="/" element={<OverviewPage />} />
      <Route path="/transfers" element={<TransfersPage />} />
      <Route path="/reconciliation" element={<ReconciliationPage />} />
      <Route path="/corridors" element={<CorridorsPage />} />
      <Route path="/compliance" element={<Stub title="Compliance" />} />
    </Routes>
  );
}

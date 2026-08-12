// apps/dashboard/src/shared/ui/Card.tsx
import type { ReactNode } from 'react';
export function Card({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <div className={`rounded-2xl bg-white border border-[#eee] p-5 ${className}`}>{children}</div>
  );
}

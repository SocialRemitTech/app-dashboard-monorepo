// apps/dashboard/src/shared/ui/Toggle.tsx
export function Toggle({
  on,
  onChange,
  label,
}: {
  on: boolean;
  onChange: (v: boolean) => void;
  label: string;
}) {
  return (
    <button
      role="switch"
      aria-checked={on}
      aria-label={label}
      onClick={() => onChange(!on)}
      className="relative h-6 w-11 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-[#FF5A2A]/40"
      style={{ background: on ? '#FF5A2A' : '#D9D3C6' }}
    >
      <span
        className="absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-all"
        style={{ left: on ? 22 : 2 }}
      />
    </button>
  );
}

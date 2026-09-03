// apps/mobile/src/shared/ui/Logo.tsx
import { Image } from 'react-native';

type Variant = 'mark-coral' | 'mark-cream' | 'lockup-coral';
const SOURCES: Record<Variant, number> = {
  'mark-coral': require('@/../assets/logo-mark-coral.png'),
  'mark-cream': require('@/../assets/logo-mark-cream.png'),
  'lockup-coral': require('@/../assets/logo-lockup-coral.png'),
};

/** Social Remit logo. `lockup-coral` = S mark + "Social Remit" wordmark. */
export function Logo({
  width = 200,
  variant = 'mark-coral',
}: {
  width?: number;
  variant?: Variant;
}) {
  const aspect = variant === 'lockup-coral' ? 656 / 298 : 1; // lockup is wide; mark is square
  return (
    <Image
      source={SOURCES[variant]}
      style={{ width, height: width / aspect, resizeMode: 'contain' }}
    />
  );
}

// apps/mobile/src/shared/ui/Logo.tsx
import { Image } from 'react-native';

/** The Social Remit S-mark. Drop logo-mark-coral.png / logo-mark-cream.png in assets/. */
export function Logo({ size = 72, variant = 'coral' }: { size?: number; variant?: 'coral' | 'cream' }) {
  const src =
    variant === 'coral'
      ? require('@/../assets/logo-mark-coral.png')
      : require('@/../assets/logo-mark-cream.png');
  return <Image source={src} style={{ width: size, height: size, resizeMode: 'contain' }} />;
}

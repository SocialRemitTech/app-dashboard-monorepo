// apps/mobile/src/shared/ui/Flag.tsx
import { Image } from 'react-native';
import { flags, type FlagCode } from '@/shared/assets';

/** Renders bundled flag art. Codes without art should fall back to an emoji at the call site. */
export function Flag({ code, size = 32 }: { code: FlagCode; size?: number }) {
  const source = flags[code];
  if (!source) return null;
  return (
    <Image
      source={source}
      style={{ width: size, height: size, borderRadius: size / 2 }}
      resizeMode="cover"
    />
  );
}

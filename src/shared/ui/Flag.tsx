// apps/mobile/src/shared/ui/Flag.tsx
import { Image } from 'react-native';

const FLAGS: Record<string, number> = {
  gb: require('@/../assets/flags/gb.png'),
  gh: require('@/../assets/flags/gh.png'),
  ng: require('@/../assets/flags/ng.png'),
  ke: require('@/../assets/flags/ke.png'),
  in: require('@/../assets/flags/in.png'),
};

export function Flag({ code, size = 28 }: { code: string; size?: number }) {
  const src = FLAGS[code];
  if (!src) return null;
  return <Image source={src} style={{ width: size, height: size * 0.67, borderRadius: 5 }} />;
}

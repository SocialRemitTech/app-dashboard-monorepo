// apps/mobile/src/features/home/screens/HomeScreen.tsx
import { SHELL_VARIANT } from '@/features/app-shell/shellVariant';
import { HomeClassic } from './HomeClassic';
import { HomeHero } from './HomeHero';

export function HomeScreen() {
  return SHELL_VARIANT === 'hero' ? <HomeHero /> : <HomeClassic />;
}

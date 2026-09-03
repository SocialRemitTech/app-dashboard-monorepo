// apps/mobile/app/(app)/(tabs)/_layout.tsx
import { Tabs } from 'expo-router';
import { SHELL_VARIANT } from '@/features/app-shell/shellVariant';
import { FloatingTabBar } from '@/shared/ui/FloatingTabBar';
import { ClassicTabBar } from '@/shared/ui/ClassicTabBar';

export default function TabsLayout() {
  const TabBar = SHELL_VARIANT === 'hero' ? FloatingTabBar : ClassicTabBar;
  return (
    <Tabs screenOptions={{ headerShown: false }} tabBar={(props) => <TabBar {...props} />}>
      <Tabs.Screen name="index" options={{ title: 'Home' }} />
      <Tabs.Screen name="transactions" options={{ title: 'Transactions' }} />
      <Tabs.Screen name="rewards" options={{ title: 'Rewards' }} />
      <Tabs.Screen name="profile" options={{ title: 'Account' }} />
    </Tabs>
  );
}

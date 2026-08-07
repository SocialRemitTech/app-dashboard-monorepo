// apps/mobile/app/(app)/(tabs)/_layout.tsx — bottom tab bar
import { Tabs } from 'expo-router';
import { color } from '@sr/design-tokens';

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: color.coral.DEFAULT, // active tab = coral (spec)
        tabBarInactiveTintColor: color.grey.light, // inactive = grey-light
        tabBarStyle: { backgroundColor: color.white },
      }}
    >
      <Tabs.Screen name="index" options={{ title: 'Home' }} />
      <Tabs.Screen name="transactions" options={{ title: 'Activity' }} />
      <Tabs.Screen name="profile" options={{ title: 'Profile' }} />
    </Tabs>
  );
}

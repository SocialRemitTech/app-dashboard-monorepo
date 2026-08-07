// apps/mobile/app/(app)/(tabs)/_layout.tsx — bottom tab bar
import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { color } from '@sr/design-tokens';

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: color.coral.DEFAULT,
        tabBarInactiveTintColor: color.grey.light,
        tabBarStyle: { backgroundColor: color.white, borderTopColor: color.border.divider },
        tabBarLabelStyle: { fontFamily: 'Inter_500Medium', fontSize: 11 },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color: c, size }) => (
            <Ionicons name="home-outline" size={size} color={c} />
          ),
        }}
      />
      <Tabs.Screen
        name="transactions"
        options={{
          title: 'Transactions',
          tabBarIcon: ({ color: c, size }) => (
            <Ionicons name="swap-vertical" size={size} color={c} />
          ),
        }}
      />
      <Tabs.Screen
        name="rewards"
        options={{
          title: 'Rewards',
          tabBarIcon: ({ color: c, size }) => (
            <Ionicons name="gift-outline" size={size} color={c} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color: c, size }) => (
            <Ionicons name="person-outline" size={size} color={c} />
          ),
        }}
      />
    </Tabs>
  );
}

// apps/mobile/src/shared/ui/ClassicTabBar.tsx
import { View, Text, Pressable } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { color } from '@sr/design-tokens';

type TabBarProps = {
  state: { index: number; routes: { key: string; name: string }[] };
  descriptors: Record<string, { options: { title?: string } }>;
  navigation: {
    emit: (e: { type: 'tabPress'; target: string; canPreventDefault: true }) => {
      defaultPrevented: boolean;
    };
    navigate: (name: string) => void;
  };
};

const ICONS: Record<
  string,
  { on: keyof typeof Ionicons.glyphMap; off: keyof typeof Ionicons.glyphMap }
> = {
  index: { on: 'home', off: 'home-outline' },
  transactions: { on: 'swap-vertical', off: 'swap-vertical-outline' },
  rewards: { on: 'gift', off: 'gift-outline' },
  profile: { on: 'help-circle', off: 'help-circle-outline' },
};

export function ClassicTabBar({ state, descriptors, navigation }: TabBarProps) {
  const insets = useSafeAreaInsets();
  return (
    <View
      style={{
        flexDirection: 'row',
        backgroundColor: color.white,
        borderTopWidth: 1,
        borderTopColor: color.border.divider,
        paddingBottom: insets.bottom,
        paddingTop: 10,
      }}
    >
      {state.routes.map((route, i) => {
        const focused = state.index === i;
        const options = descriptors[route.key]?.options ?? {};
        const label = (options.title ?? route.name) as string;
        const icon = ICONS[route.name] ?? { on: 'ellipse', off: 'ellipse-outline' };
        const onPress = () => {
          const e = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });
          if (!focused && !e.defaultPrevented) navigation.navigate(route.name);
        };
        return (
          <Pressable key={route.key} onPress={onPress} className="flex-1 items-center gap-1">
            <Ionicons
              name={focused ? icon.on : icon.off}
              size={24}
              color={focused ? color.coral.DEFAULT : color.navy.deep}
            />
            <Text
              className="font-sans-medium"
              style={{ fontSize: 11, color: focused ? color.coral.DEFAULT : color.navy.deep }}
            >
              {label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

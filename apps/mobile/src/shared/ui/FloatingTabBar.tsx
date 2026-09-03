// apps/mobile/src/shared/ui/FloatingTabBar.tsx
import { View, Text, Pressable } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { color } from '@sr/design-tokens';

// Local structural type (SDK 56 forbids importing from @react-navigation/*).
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

const ICONS: Record<string, keyof typeof Ionicons.glyphMap> = {
  index: 'home',
  transactions: 'swap-vertical',
  rewards: 'gift',
  profile: 'person',
};

/** Active tab = coral pill with label; the rest = navy circles. Floats above content. */
export function FloatingTabBar({ state, descriptors, navigation }: TabBarProps) {
  const insets = useSafeAreaInsets();
  return (
    <View
      style={{
        position: 'absolute',
        left: 16,
        right: 16,
        bottom: insets.bottom + 10,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 10,
      }}
    >
      {state.routes.map((route, i) => {
        const focused = state.index === i;
        const options = descriptors[route.key]?.options ?? {};
        const label = (options.title ?? route.name) as string;
        const icon = ICONS[route.name] ?? 'ellipse';

        const onPress = () => {
          const e = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });
          if (!focused && !e.defaultPrevented) navigation.navigate(route.name);
        };

        if (focused) {
          return (
            <Pressable
              key={route.key}
              onPress={onPress}
              style={{
                height: 54,
                paddingHorizontal: 22,
                borderRadius: 27,
                backgroundColor: color.coral.DEFAULT,
                flexDirection: 'row',
                alignItems: 'center',
                gap: 8,
                shadowColor: color.coral.DEFAULT,
                shadowOpacity: 0.35,
                shadowRadius: 12,
                shadowOffset: { width: 0, height: 6 },
                elevation: 6,
              }}
            >
              <Ionicons name={icon} size={22} color={color.white} />
              <Text className="font-sans-semibold text-white" style={{ fontSize: 15 }}>
                {label}
              </Text>
            </Pressable>
          );
        }
        return (
          <Pressable
            key={route.key}
            onPress={onPress}
            style={{
              height: 54,
              width: 54,
              borderRadius: 27,
              backgroundColor: color.navy.deep,
              alignItems: 'center',
              justifyContent: 'center',
              shadowColor: '#000',
              shadowOpacity: 0.18,
              shadowRadius: 10,
              shadowOffset: { width: 0, height: 5 },
              elevation: 5,
            }}
          >
            <Ionicons name={icon} size={22} color={color.cream} />
          </Pressable>
        );
      })}
    </View>
  );
}

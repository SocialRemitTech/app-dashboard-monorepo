// apps/mobile/src/features/auth/components/RotatingHero.tsx
import { useEffect, useRef } from 'react';
import { View, Animated, type ImageSourcePropType, type DimensionValue } from 'react-native';

/**
 * Crossfades hero images on a timer (Wise-style). Runs entirely on Animated values —
 * NO React state — so it never triggers a render-phase update. The sign-in card above
 * stays fixed; only the backdrop rotates.
 */
export function RotatingHero({
  sources,
  height,
  intervalMs = 4000,
}: {
  sources: ImageSourcePropType[];
  height: DimensionValue;
  intervalMs?: number;
}) {
  const n = sources.length;
  const opacity = useRef(sources.map((_, i) => new Animated.Value(i === 0 ? 1 : 0))).current;
  const scale = useRef(sources.map(() => new Animated.Value(1))).current;
  const dotW = useRef(sources.map((_, i) => new Animated.Value(i === 0 ? 18 : 6))).current;
  const dotO = useRef(sources.map((_, i) => new Animated.Value(i === 0 ? 1 : 0.5))).current;
  const idx = useRef(0);

  useEffect(() => {
    if (n <= 1) return;
    const t = setInterval(() => {
      const cur = idx.current;
      const next = (cur + 1) % n;
      scale[next]!.setValue(1.08);
      Animated.parallel([
        Animated.timing(opacity[cur]!, { toValue: 0, duration: 900, useNativeDriver: true }),
        Animated.timing(opacity[next]!, { toValue: 1, duration: 900, useNativeDriver: true }),
        Animated.timing(scale[next]!, { toValue: 1, duration: 5000, useNativeDriver: true }),
        Animated.timing(dotW[cur]!, { toValue: 6, duration: 300, useNativeDriver: false }),
        Animated.timing(dotW[next]!, { toValue: 18, duration: 300, useNativeDriver: false }),
        Animated.timing(dotO[cur]!, { toValue: 0.5, duration: 300, useNativeDriver: false }),
        Animated.timing(dotO[next]!, { toValue: 1, duration: 300, useNativeDriver: false }),
      ]).start();
      idx.current = next;
    }, intervalMs);
    return () => clearInterval(t);
  }, [intervalMs, n, opacity, scale, dotW, dotO]);

  return (
    <View style={{ width: '100%', height, overflow: 'hidden', backgroundColor: '#12233B' }}>
      {sources.map((src, i) => (
        <Animated.Image
          key={i}
          source={src}
          resizeMode="cover"
          style={{
            position: 'absolute',
            width: '100%',
            height: '100%',
            opacity: opacity[i],
            transform: [{ scale: scale[i]! }],
          }}
        />
      ))}
      <View
        style={{
          position: 'absolute',
          bottom: 16,
          alignSelf: 'center',
          flexDirection: 'row',
          gap: 6,
        }}
      >
        {sources.map((_, i) => (
          <Animated.View
            key={i}
            style={{
              height: 6,
              width: dotW[i],
              borderRadius: 3,
              backgroundColor: '#FFFFFF',
              opacity: dotO[i],
            }}
          />
        ))}
      </View>
    </View>
  );
}

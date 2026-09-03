// apps/mobile/src/features/intro/IntroCarousel.tsx
import { useEffect, useRef, useState } from 'react';
import { View, Dimensions, type ImageSourcePropType, Image } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  interpolate,
  Extrapolation,
  type SharedValue,
} from 'react-native-reanimated';
import { color } from '@sr/design-tokens';

const { width: W, height: H } = Dimensions.get('window');
const AUTO_MS = 4000;

const SLIDES: ImageSourcePropType[] = [
  require('@/../assets/intro/slide1.png'),
  require('@/../assets/intro/slide2.png'),
  require('@/../assets/intro/slide3.png'),
];

export function IntroCarousel({ onIndexChange }: { onIndexChange?: (i: number) => void }) {
  const ref = useRef<Animated.FlatList<ImageSourcePropType>>(null);
  const scrollX = useSharedValue(0);
  const [index, setIndex] = useState(0);
  const paused = useRef(false);

  const onScroll = useAnimatedScrollHandler((e) => {
    scrollX.value = e.contentOffset.x;
  });

  useEffect(() => {
    const t = setInterval(() => {
      if (paused.current) return;
      const next = (index + 1) % SLIDES.length;
      ref.current?.scrollToOffset({ offset: next * W, animated: true });
    }, AUTO_MS);
    return () => clearInterval(t);
  }, [index]);

  return (
    <View style={{ flex: 1 }}>
      <Animated.FlatList
        ref={ref}
        data={SLIDES}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        keyExtractor={(_, i) => String(i)}
        onScroll={onScroll}
        scrollEventThrottle={16}
        onScrollBeginDrag={() => {
          paused.current = true;
        }}
        onMomentumScrollEnd={(e) => {
          paused.current = false;
          const i = Math.round(e.nativeEvent.contentOffset.x / W);
          setIndex(i);
          onIndexChange?.(i);
        }}
        renderItem={({ item, index: i }) => <Slide source={item} i={i} scrollX={scrollX} />}
      />
      <Dots count={SLIDES.length} scrollX={scrollX} />
    </View>
  );
}

function Slide({
  source,
  i,
  scrollX,
}: {
  source: ImageSourcePropType;
  i: number;
  scrollX: SharedValue<number>;
}) {
  const input = [(i - 1) * W, i * W, (i + 1) * W];
  const imgStyle = useAnimatedStyle(() => ({
    transform: [
      {
        translateX: interpolate(
          scrollX.value,
          input,
          [W * 0.15, 0, -W * 0.15],
          Extrapolation.CLAMP,
        ),
      },
      { scale: interpolate(scrollX.value, input, [1.15, 1.06, 1.15], Extrapolation.CLAMP) },
    ],
  }));
  return (
    <View style={{ width: W, height: H, overflow: 'hidden', backgroundColor: color.coral.DEFAULT }}>
      <Animated.View style={[{ width: W, height: H }, imgStyle]}>
        <Image source={source} style={{ width: W, height: H }} resizeMode="cover" />
      </Animated.View>
    </View>
  );
}

function Dots({ count, scrollX }: { count: number; scrollX: SharedValue<number> }) {
  return (
    <View
      style={{
        position: 'absolute',
        bottom: 148,
        alignSelf: 'center',
        flexDirection: 'row',
        gap: 8,
      }}
    >
      {Array.from({ length: count }).map((_, i) => (
        <Dot key={i} i={i} scrollX={scrollX} />
      ))}
    </View>
  );
}
function Dot({ i, scrollX }: { i: number; scrollX: SharedValue<number> }) {
  const style = useAnimatedStyle(() => {
    const input = [(i - 1) * W, i * W, (i + 1) * W];
    return {
      width: interpolate(scrollX.value, input, [8, 22, 8], Extrapolation.CLAMP),
      opacity: interpolate(scrollX.value, input, [0.5, 1, 0.5], Extrapolation.CLAMP),
    };
  });
  return (
    <Animated.View style={[{ height: 8, borderRadius: 4, backgroundColor: '#FFFFFF' }, style]} />
  );
}

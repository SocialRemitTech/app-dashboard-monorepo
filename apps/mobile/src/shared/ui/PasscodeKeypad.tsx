// apps/mobile/src/shared/ui/PasscodeKeypad.tsx
import { View, Text, Pressable } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { color } from '@sr/design-tokens';

/**
 * Social Remit's own numeric keypad — the OS keyboard is never shown for passcode entry.
 *
 * Geometry measured off the design (390pt screen):
 *   column pitch 113 · row pitch 69 · key Ø58  →  wide side gutters, tight rows.
 */
const KEY = 58;
const GRID_W = 284; // 3 keys + 2 gutters of ~55
const ROW_GAP = 11;
const KEY_BG = '#EEEBE4';
const KEY_BG_PRESSED = '#DFDACE';
const PEACH_TINT = 'rgba(255,90,42,0.12)';

type Props = {
  onDigit: (d: string) => void;
  onBackspace: () => void;
  onBiometric?: () => void;
};

export function PasscodeKeypad({ onDigit, onBackspace, onBiometric }: Props) {
  const rows = [
    ['1', '2', '3'],
    ['4', '5', '6'],
    ['7', '8', '9'],
  ];

  return (
    <View style={{ width: GRID_W, alignSelf: 'center' }}>
      {rows.map((row) => (
        <View
          key={row[0]}
          style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: ROW_GAP }}
        >
          {row.map((d) => (
            <DigitKey key={d} digit={d} onPress={() => onDigit(d)} />
          ))}
        </View>
      ))}

      {/* Three fixed slots so 0 stays under the middle column and ⌫ under the right one. */}
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
        <View style={{ width: KEY, height: KEY, alignItems: 'center', justifyContent: 'center' }}>
          {onBiometric ? (
            <Pressable
              onPress={onBiometric}
              accessibilityRole="button"
              accessibilityLabel="Use Face ID"
              style={({ pressed }) => ({
                width: KEY,
                height: KEY,
                borderRadius: KEY / 2,
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: pressed ? 'rgba(255,90,42,0.22)' : PEACH_TINT,
              })}
            >
              <MaterialCommunityIcons
                name="face-recognition"
                size={26}
                color={color.coral.DEFAULT}
              />
            </Pressable>
          ) : null}
        </View>

        <DigitKey digit="0" onPress={() => onDigit('0')} />

        <View style={{ width: KEY, height: KEY, alignItems: 'center', justifyContent: 'center' }}>
          <Pressable
            onPress={onBackspace}
            accessibilityRole="button"
            accessibilityLabel="Delete"
            hitSlop={10}
            style={({ pressed }) => ({
              width: KEY,
              height: KEY,
              alignItems: 'center',
              justifyContent: 'center',
              opacity: pressed ? 0.5 : 1,
            })}
          >
            <Ionicons name="backspace-outline" size={27} color={color.navy.deep} />
          </Pressable>
        </View>
      </View>
    </View>
  );
}

function DigitKey({ digit, onPress }: { digit: string; onPress: () => void }) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={digit}
      style={({ pressed }) => ({
        width: KEY,
        height: KEY,
        borderRadius: KEY / 2,
        backgroundColor: pressed ? KEY_BG_PRESSED : KEY_BG,
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
      })}
    >
      <Text
        allowFontScaling={false}
        style={{ fontSize: 26, lineHeight: 31, color: color.navy.deep, includeFontPadding: false }}
      >
        {digit}
      </Text>
    </Pressable>
  );
}

// apps/mobile/src/features/open-banking/screens/ChooseBankScreen.tsx
import { useState } from 'react';
import { View, Text, Pressable, ScrollView, TextInput } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Screen } from '@/shared/ui/Screen';
import { BackButton } from '@/shared/ui/BackButton';
import { banks, type Bank } from '@/features/open-banking/data/banks';
import { useOpenBanking } from '@/features/open-banking/stores/openbanking.store';
import { color } from '@sr/design-tokens';

export function ChooseBankScreen() {
  const selectBank = useOpenBanking((s) => s.selectBank);
  const context = useOpenBanking((s) => s.context);
  const [q, setQ] = useState('');
  const filtered = banks.filter((b) => b.name.toLowerCase().includes(q.toLowerCase()));
  const popular = filtered.filter((b) => b.popular);
  const all = filtered.filter((b) => !b.popular);

  const pick = (b: Bank) => {
    selectBank({ id: b.id, name: b.name, color: b.color, initials: b.initials });
    router.push('/(app)/open-banking/authorise');
  };

  const Tile = ({ b }: { b: Bank }) => (
    <Pressable onPress={() => pick(b)} className="flex-row items-center py-3">
      <View
        className="h-11 w-11 rounded-xl items-center justify-center mr-3"
        style={{ backgroundColor: b.color }}
      >
        <Text className="font-sans-bold text-caption text-white">{b.initials}</Text>
      </View>
      <Text className="flex-1 font-sans-semibold text-base text-navy-deep">{b.name}</Text>
      <Ionicons name="chevron-forward" size={18} color={color.grey.light} />
    </Pressable>
  );

  return (
    <Screen>
      <View className="pt-2">
        <BackButton
          fallback={context === 'topup' ? '/(app)/wallet/method' : '/(app)/send/summary'}
        />
      </View>
      <Text className="font-display-bold text-navy-deep mt-3" style={{ fontSize: 28 }}>
        Choose your bank
      </Text>
      <Text className="font-sans text-body text-navy/55 mt-1">
        Securely connect your bank using Open Banking
      </Text>

      <View className="mt-4 h-12 rounded-pill bg-white border border-border flex-row items-center px-4 gap-2">
        <Ionicons name="search" size={18} color={color.grey.light} />
        <TextInput
          value={q}
          onChangeText={setQ}
          placeholder="Search for your bank"
          placeholderTextColor={color.grey.light}
          className="flex-1 font-sans text-base text-navy"
        />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} className="flex-1 mt-4">
        {popular.length > 0 ? (
          <>
            <Text className="font-sans-bold text-caption tracking-widest text-navy/40 mb-1">
              POPULAR BANKS
            </Text>
            {popular.map((b) => (
              <Tile key={b.id} b={b} />
            ))}
          </>
        ) : null}
        {all.length > 0 ? (
          <>
            <Text className="font-sans-bold text-caption tracking-widest text-navy/40 mt-4 mb-1">
              ALL SUPPORTED BANKS
            </Text>
            {all.map((b) => (
              <Tile key={b.id} b={b} />
            ))}
          </>
        ) : null}
        <View className="h-6" />
      </ScrollView>
    </Screen>
  );
}

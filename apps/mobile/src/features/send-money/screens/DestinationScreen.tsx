// apps/mobile/src/features/send-money/screens/DestinationScreen.tsx
import { useState } from 'react';
import { View, Text, Pressable, ScrollView, TextInput } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Screen } from '@/shared/ui/Screen';
import { BackButton } from '@/shared/ui/BackButton';
import { Button } from '@/shared/ui/Button';
import { Flag } from '@/shared/ui/Flag';
import { color } from '@sr/design-tokens';
import { corridors, comingSoonCorridors } from '@/features/send-money/data/corridors';
import { useSend } from '@/features/send-money/stores/send.store';

export function DestinationScreen() {
  const { corridor, setCorridor } = useSend();
  const [query, setQuery] = useState('');
  const q = query.toLowerCase();
  const list = corridors.filter((c) => c.country.toLowerCase().includes(q));
  const soon = comingSoonCorridors.filter((c) => c.country.toLowerCase().includes(q));

  return (
    <Screen>
      <View className="pt-2 flex-row items-center justify-between">
        <BackButton fallback="/(app)/(tabs)" />
        <Text className="font-sans text-body text-navy/55">Need help?</Text>
      </View>

      <Text
        className="font-display-bold text-navy-deep mt-4"
        style={{ fontSize: 30, lineHeight: 34 }}
      >
        Where are you sending money today?
      </Text>
      <Text className="font-sans text-body text-navy/60 mt-1">Select your destination</Text>

      <View className="mt-5 h-12 rounded-pill bg-white border border-border flex-row items-center px-4 gap-2">
        <Ionicons name="search" size={18} color={color.grey.light} />
        <TextInput
          value={query}
          onChangeText={setQuery}
          placeholder="Search countries..."
          placeholderTextColor={color.grey.light}
          className="flex-1 font-sans text-base text-navy"
        />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} className="flex-1 mt-5">
        <View className="flex-row items-center gap-2 mb-3">
          <Ionicons name="star" size={16} color={color.coral.DEFAULT} />
          <Text className="font-sans-bold text-label text-navy-deep">Popular Destinations</Text>
        </View>
        <View className="gap-3">
          {list.map((c) => {
            const selected = c.id === corridor.id;
            return (
              <Pressable
                key={c.id}
                onPress={() => c.live && setCorridor(c)}
                className={`rounded-card px-4 py-4 flex-row items-center ${selected ? 'bg-coral/10 border border-coral/40' : 'bg-white border border-border/60'} ${!c.live ? 'opacity-60' : ''}`}
              >
                <Flag code={c.flag} size={40} />
                <View className="flex-1 ml-3">
                  <Text className="font-sans-bold text-base text-navy-deep">{c.country}</Text>
                  <Text className="font-sans text-caption text-navy/50">
                    £1 = {c.rate.toLocaleString('en-GB', { minimumFractionDigits: 2 })} {c.currency}
                  </Text>
                </View>
                {selected ? (
                  <View className="h-6 w-6 rounded-pill bg-coral items-center justify-center">
                    <Ionicons name="checkmark" size={16} color={color.white} />
                  </View>
                ) : !c.live ? (
                  <Text className="font-sans-medium text-caption text-navy/40">Soon</Text>
                ) : null}
              </Pressable>
            );
          })}
        </View>

        {soon.length > 0 ? (
          <>
            <Text className="font-sans-bold text-label text-navy-deep mt-7 mb-3">
              More Destinations Coming Soon
            </Text>
            <View className="gap-3">
              {soon.map((c) => (
                <View
                  key={c.code}
                  className="rounded-card px-4 py-4 flex-row items-center bg-white/60 border border-border/50"
                >
                  <Text style={{ fontSize: 30 }}>{c.flag}</Text>
                  <Text className="flex-1 ml-3 font-sans-semibold text-base text-navy/60">
                    {c.country}
                  </Text>
                  <View className="rounded-pill bg-border-divider px-3 py-1">
                    <Text className="font-sans-medium text-caption text-navy/45">Coming soon</Text>
                  </View>
                </View>
              ))}
            </View>
          </>
        ) : null}
        <View className="h-4" />
      </ScrollView>

      <View className="pt-2 pb-4">
        <Button
          label="Continue"
          onPress={() => router.push('/(app)/send/amount')}
          disabled={!corridor.live}
        />
      </View>
    </Screen>
  );
}

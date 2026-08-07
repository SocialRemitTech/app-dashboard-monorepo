// apps/mobile/src/features/send-money/screens/ProcessingScreen.tsx
import { useEffect, useState } from 'react';
import { View, Text } from 'react-native';
import { router } from 'expo-router';
import { Screen } from '@/shared/ui/Screen';
import { Button } from '@/shared/ui/Button';
import { formatMoney } from '@/shared/ui/money';
import { useSend } from '@/features/send-money/stores/send.store';
import { color } from '@sr/design-tokens';

type Step = { title: string; time: string; state: 'done' | 'active' | 'pending' };

export function ProcessingScreen() {
  const { corridor, recipientName, receive, reset } = useSend();
  const [delivered, setDelivered] = useState(false);

  // Mock status progression. Production: push + polling maps partner status → canonical status.
  useEffect(() => {
    const t = setTimeout(() => setDelivered(true), 3500);
    return () => clearTimeout(t);
  }, []);

  const now = new Date();
  const t1 = new Date(now.getTime() - 60000).toLocaleTimeString('en-GB', {
    hour: '2-digit',
    minute: '2-digit',
  });
  const t2 = now.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });

  const steps: Step[] = [
    { title: 'Payment received', time: t1, state: 'done' },
    { title: 'Processing transfer', time: t2, state: delivered ? 'done' : 'active' },
    { title: 'Delivered', time: delivered ? t2 : 'Pending', state: delivered ? 'done' : 'pending' },
  ];

  const done = () => {
    reset();
    router.replace('/(app)/(tabs)');
  };

  return (
    <Screen>
      <View className="items-center mt-10 gap-1">
        <Text className="font-display-bold text-navy-deep" style={{ fontSize: 24 }}>
          Transfer sent
        </Text>
        <Text className="font-display-bold text-navy-deep" style={{ fontSize: 36 }}>
          {corridor.currency} {formatMoney(receive())}
        </Text>
        <Text className="font-sans text-body text-navy/55 mt-1">
          {delivered ? 'Delivered to' : 'Processing transfer to'} {recipientName || 'recipient'}
        </Text>
        <View
          className="rounded-pill px-4 py-1.5 mt-3"
          style={{ backgroundColor: delivered ? '#DCFCE7' : '#DCFCE7' }}
        >
          <Text className="font-sans-semibold text-body" style={{ color: color.success.transfer }}>
            {delivered ? '● Delivered' : '● Processing'}
          </Text>
        </View>
        <Text className="font-sans text-caption text-navy/45 mt-2">
          We’ll update you as it moves
        </Text>
      </View>

      {/* Live tracking */}
      <View className="rounded-card bg-white border border-border/60 p-5 mt-6">
        <Text className="font-sans-bold text-base text-navy-deep mb-3">Live Tracking</Text>
        {steps.map((s, i) => (
          <View key={s.title} className="flex-row">
            <View className="items-center mr-3">
              <View
                className="h-5 w-5 rounded-pill items-center justify-center"
                style={{
                  backgroundColor: s.state === 'pending' ? '#E5E7EB' : color.success.transfer,
                }}
              >
                {s.state === 'active' ? <View className="h-2 w-2 rounded-pill bg-white" /> : null}
              </View>
              {i < steps.length - 1 ? (
                <View
                  className="w-0.5 flex-1 my-1"
                  style={{
                    backgroundColor: s.state === 'done' ? color.success.transfer : '#E5E7EB',
                    minHeight: 28,
                  }}
                />
              ) : null}
            </View>
            <View className="pb-4">
              <Text
                className={`font-sans-bold text-base ${s.state === 'pending' ? 'text-navy/40' : 'text-navy-deep'}`}
              >
                {s.title}
              </Text>
              <Text className="font-sans text-caption text-navy/45">{s.time}</Text>
            </View>
          </View>
        ))}
      </View>

      <View className="flex-1" />
      <View className="pb-4 gap-3">
        <Button label="Continue" onPress={done} />
        <Button label="View tracking" variant="outline" onPress={() => {}} />
      </View>
    </Screen>
  );
}

// apps/mobile/src/features/menu/screens/SettingsScreen.tsx
import { useState } from 'react';
import { View, Text, ScrollView, Switch, Pressable } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Screen } from '@/shared/ui/Screen';
import { PageHeader } from '@/shared/ui/PageHeader';
import { SectionLabel } from '@/shared/ui/ListRow';
import { useSession } from '@/features/auth/stores/session.store';
import { color } from '@sr/design-tokens';

function ToggleRow({
  label,
  value,
  onChange,
}: {
  label: string;
  value: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <View className="flex-row items-center justify-between py-3 border-b border-border-divider">
      <Text className="font-sans text-base text-navy-deep">{label}</Text>
      <Switch
        value={value}
        onValueChange={onChange}
        trackColor={{ true: color.coral.DEFAULT, false: '#D9D3C6' }}
        thumbColor="#fff"
      />
    </View>
  );
}
function LinkRow({
  label,
  value,
  danger,
  onPress,
}: {
  label: string;
  value?: string;
  danger?: boolean;
  onPress?: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      className="flex-row items-center justify-between py-3.5 border-b border-border-divider"
    >
      <Text className={`font-sans text-base ${danger ? 'text-error' : 'text-navy-deep'}`}>
        {label}
      </Text>
      <View className="flex-row items-center gap-1">
        {value ? <Text className="font-sans text-body text-navy/45">{value}</Text> : null}
        <Ionicons name="chevron-forward" size={16} color={color.grey.light} />
      </View>
    </Pressable>
  );
}

export function SettingsScreen() {
  const signOut = useSession((s) => s.signOut);
  const [push, setPush] = useState(true);
  const [receipts, setReceipts] = useState(true);
  const [sms, setSms] = useState(false);
  const [bio, setBio] = useState(true);

  return (
    <Screen>
      <ScrollView showsVerticalScrollIndicator={false} className="flex-1">
        <PageHeader title="Settings" />
        <SectionLabel>NOTIFICATIONS</SectionLabel>
        <ToggleRow label="Push notifications" value={push} onChange={setPush} />
        <ToggleRow label="Email receipts" value={receipts} onChange={setReceipts} />
        <ToggleRow label="SMS updates" value={sms} onChange={setSms} />

        <SectionLabel>SECURITY</SectionLabel>
        <ToggleRow label="Biometric unlock" value={bio} onChange={setBio} />
        <LinkRow label="Change passcode" onPress={() => {}} />

        <SectionLabel>PREFERENCES</SectionLabel>
        <LinkRow label="Language" value="English" onPress={() => {}} />
        <LinkRow label="Currency" value="GBP" onPress={() => {}} />

        <SectionLabel>ACCOUNT</SectionLabel>
        <LinkRow label="Log out" onPress={() => void signOut()} />
        <LinkRow label="Delete account" danger onPress={() => {}} />
        <View className="h-6" />
      </ScrollView>
    </Screen>
  );
}

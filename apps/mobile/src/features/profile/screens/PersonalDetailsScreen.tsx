// apps/mobile/src/features/profile/screens/PersonalDetailsScreen.tsx
import { useState } from 'react';
import { View, Text, Pressable, ScrollView, Share } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Screen } from '@/shared/ui/Screen';
import { ContactSupportFooter } from '@/shared/ui/ContactSupportFooter';
import { AccountStateSheet } from '@/features/profile/components/AccountStateSheet';
import { SetupAccountSheet } from '@/features/profile/components/SetupAccountSheet';
import { useAccountState, verificationSummary } from '@/features/profile/stores/accountState.store';
import { color } from '@sr/design-tokens';

const TONE = { muted: '#9CA3AF', progress: '#F59E0B', warn: '#D64545', ok: '#2E9B63' } as const;
const AMBER = '#F0A020'; // "in progress" CTA — deliberately NOT coral

type BannerSpec = {
  icon: keyof typeof Ionicons.glyphMap;
  iconTint: string;
  iconColor: string;
  title: string;
  body: string;
  cta: string;
  ctaColor: string;
};

/** One banner per state. Every CTA opens the same setup sheet, which resumes progress. */
function bannerFor(state: string): BannerSpec | null {
  switch (state) {
    case 'setup_not_started':
    case 'setup_in_progress':
      return {
        icon: 'person-add-outline',
        iconTint: 'rgba(255,90,42,0.10)',
        iconColor: color.coral.DEFAULT,
        title: 'Finish setting up your account',
        body: "Add your details when you're ready. You can still check rates, explore Social Remit and prepare a transfer.",
        cta: 'Complete setup',
        ctaColor: color.coral.DEFAULT,
      };
    case 'verification_not_started':
      return {
        icon: 'shield-checkmark-outline',
        iconTint: 'rgba(255,90,42,0.10)',
        iconColor: color.coral.DEFAULT,
        title: 'Verify your identity',
        body: 'One last step before your first transfer. It takes less than a minute and is only needed once.',
        cta: 'Verify now',
        ctaColor: color.coral.DEFAULT,
      };
    case 'verification_in_progress':
      return {
        icon: 'time-outline',
        iconTint: 'rgba(240,160,32,0.12)',
        iconColor: AMBER,
        title: 'Verification in progress',
        body: "We're completing the required checks. We'll let you know when they're complete.",
        cta: 'View progress',
        ctaColor: AMBER,
      };
    case 'more_info_needed':
      return {
        icon: 'alert-circle-outline',
        iconTint: 'rgba(255,90,42,0.10)',
        iconColor: color.coral.DEFAULT,
        title: 'We need a little more information',
        body: "We need some additional information to complete your verification. We'll guide you through what's needed.",
        cta: 'Continue verification',
        ctaColor: color.coral.DEFAULT,
      };
    default:
      return null; // verified — no banner
  }
}

export function PersonalDetailsScreen() {
  const s = useAccountState();
  const [statePicker, setStatePicker] = useState(false);
  const [setupSheet, setSetupSheet] = useState(false);
  const verification = verificationSummary(s.state);
  const banner = bannerFor(s.state);

  const copyId = async () => {
    try {
      await Share.share({ message: s.socialRemitId });
    } catch {
      /* dismissed */
    }
  };

  return (
    <Screen>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 40 }}
      >
        <View className="pt-2">
          <Pressable
            onPress={() => router.back()}
            className="h-11 w-11 rounded-pill bg-white border border-border/60 items-center justify-center"
          >
            <Ionicons name="arrow-back" size={20} color={color.navy.deep} />
          </Pressable>
        </View>

        <Text className="font-display-bold text-navy-deep mt-4" style={{ fontSize: 30 }}>
          Personal details
        </Text>

        {/* Every state's CTA routes through the setup sheet so progress is always visible
            and the customer resumes at the first outstanding step. */}
        {banner ? (
          <View className="rounded-card bg-white border border-border/60 mt-5 px-5 py-5">
            <View className="flex-row items-start gap-3">
              <View
                className="h-11 w-11 rounded-input items-center justify-center"
                style={{ backgroundColor: banner.iconTint }}
              >
                <Ionicons name={banner.icon} size={22} color={banner.iconColor} />
              </View>
              <View className="flex-1">
                <Text className="font-sans-bold text-navy-deep" style={{ fontSize: 18 }}>
                  {banner.title}
                </Text>
                <Text
                  className="font-sans text-navy/55 mt-1.5"
                  style={{ fontSize: 15, lineHeight: 22 }}
                >
                  {banner.body}
                </Text>
              </View>
            </View>
            <Pressable
              onPress={() => setSetupSheet(true)}
              className="rounded-button items-center justify-center mt-4"
              style={{ height: 54, backgroundColor: banner.ctaColor }}
            >
              <Text className="font-sans-bold text-white" style={{ fontSize: 17 }}>
                {banner.cta}
              </Text>
            </Pressable>
          </View>
        ) : null}

        <View className="rounded-card bg-white border border-border/60 mt-5 px-5">
          <Field label="Preferred name" value={s.preferredName} first />
          <Field label="Legal name" value={s.legalName} />
          <Field label="Date of birth" value={s.dateOfBirth} />
          <Field label="Home address" value={s.homeAddress} />
          <Field
            label="Email address"
            value={s.emailAddress}
            confirmed={s.emailConfirmed}
            confirmedLabel="Email confirmed"
          />

          <View className="py-4 border-t border-border-divider">
            <Text className="font-sans text-navy/50" style={{ fontSize: 14 }}>
              Mobile number
            </Text>
            <View className="flex-row items-center gap-2 mt-1">
              <Text className="font-sans-bold text-navy-deep" style={{ fontSize: 17 }}>
                {s.mobileNumber}
              </Text>
              {s.mobileConfirmed ? <ConfirmedPill label="Mobile confirmed" /> : null}
            </View>
          </View>

          <View className="py-4 border-t border-border-divider">
            <Text className="font-sans text-navy/50" style={{ fontSize: 14 }}>
              Social Remit ID
            </Text>
            <Pressable onPress={copyId} className="flex-row items-center gap-2 mt-1">
              <Text className="font-sans-bold text-navy-deep" style={{ fontSize: 17 }}>
                {s.socialRemitId}
              </Text>
              <Ionicons name="copy-outline" size={15} color={color.grey.mid} />
            </Pressable>
          </View>

          <View className="py-4 border-t border-border-divider">
            <Text className="font-sans text-navy/50" style={{ fontSize: 14 }}>
              Account verification
            </Text>
            <Text
              className="font-sans mt-1"
              style={{
                fontSize: 17,
                color: TONE[verification.tone],
                fontStyle: verification.tone === 'muted' ? 'italic' : 'normal',
              }}
            >
              {verification.label}
            </Text>
          </View>
        </View>

        <ContactSupportFooter />

        <Pressable
          onPress={() => setStatePicker(true)}
          className="flex-row items-center justify-center gap-2 self-center rounded-pill px-5 py-3"
          style={{ backgroundColor: '#F1F0EE' }}
        >
          <Ionicons name="refresh" size={15} color={color.navy.deep} />
          <Text className="font-sans-semibold text-navy-deep" style={{ fontSize: 15 }}>
            Change test state
          </Text>
        </Pressable>
      </ScrollView>

      <SetupAccountSheet visible={setupSheet} onClose={() => setSetupSheet(false)} />
      <AccountStateSheet visible={statePicker} onClose={() => setStatePicker(false)} />
    </Screen>
  );
}

function ConfirmedPill({ label }: { label: string }) {
  return (
    <View
      className="flex-row items-center gap-1 rounded-pill px-2.5 py-1"
      style={{ backgroundColor: 'rgba(46,155,99,0.10)' }}
    >
      <Ionicons name="checkmark" size={12} color="#2E9B63" />
      <Text className="font-sans-semibold" style={{ fontSize: 12.5, color: '#2E9B63' }}>
        {label}
      </Text>
    </View>
  );
}

function Field({
  label,
  value,
  first,
  confirmed,
  confirmedLabel,
}: {
  label: string;
  value: string;
  first?: boolean;
  confirmed?: boolean;
  confirmedLabel?: string;
}) {
  const empty = !value;
  return (
    <Pressable
      className={`flex-row items-center py-4 ${first ? '' : 'border-t border-border-divider'}`}
    >
      <View className="flex-1">
        <Text className="font-sans text-navy/50" style={{ fontSize: 14 }}>
          {label}
        </Text>
        <View className="flex-row items-center gap-2 mt-1">
          <Text
            className={empty ? 'font-sans' : 'font-sans-bold'}
            style={{
              fontSize: 17,
              color: empty ? '#B9B5AE' : color.navy.deep,
              fontStyle: empty ? 'italic' : 'normal',
            }}
          >
            {empty ? 'Please add' : value}
          </Text>
          {!empty && confirmed && confirmedLabel ? <ConfirmedPill label={confirmedLabel} /> : null}
        </View>
      </View>
      {empty ? <Ionicons name="chevron-forward" size={18} color={color.grey.light} /> : null}
    </Pressable>
  );
}

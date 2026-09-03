// apps/mobile/src/shared/ui/KeyboardAwareScreen.tsx
import type { ReactNode } from 'react';
import {
  View,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
  Keyboard,
  TouchableWithoutFeedback,
} from 'react-native';
import { SafeAreaView, type Edge } from 'react-native-safe-area-context';
import { color } from '@sr/design-tokens';

type Props = {
  children: ReactNode;
  /** Sticks to the bottom (e.g. the primary button) and stays above the keyboard. */
  footer?: ReactNode;
  dismissOnTap?: boolean;
  edges?: Edge[];
  contentBottomPadding?: number;
  background?: string;
};

/**
 * Use for ANY screen containing a TextInput. Horizontal padding is 16 to match Screen,
 * so gutters never shift between screens.
 */
export function KeyboardAwareScreen({
  children,
  footer,
  dismissOnTap = true,
  edges = ['top', 'bottom'],
  contentBottomPadding = 24,
  background = color.cream,
}: Props) {
  const Body = (
    <ScrollView
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
      keyboardDismissMode="interactive"
      contentContainerStyle={{
        flexGrow: 1,
        paddingHorizontal: 16,
        paddingBottom: contentBottomPadding,
      }}
    >
      {children}
    </ScrollView>
  );

  return (
    <View style={{ flex: 1, backgroundColor: background }}>
      <SafeAreaView style={{ flex: 1 }} edges={edges}>
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          keyboardVerticalOffset={0}
        >
          {dismissOnTap ? (
            <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
              <View style={{ flex: 1 }}>{Body}</View>
            </TouchableWithoutFeedback>
          ) : (
            Body
          )}
          {footer ? <View style={{ paddingHorizontal: 16, paddingTop: 8 }}>{footer}</View> : null}
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  );
}

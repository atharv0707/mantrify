import React, { useCallback, useEffect } from 'react';
import { Platform, Pressable, StyleSheet, Text } from 'react-native';
import * as WebBrowser from 'expo-web-browser';
import * as Google from 'expo-auth-session/providers/google';
import { colors, radii } from '../theme/colors';
import { fonts } from '../theme/typography';

WebBrowser.maybeCompleteAuthSession();

const WEB_CLIENT_ID = process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID ?? '';
const IOS_CLIENT_ID = process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID ?? '';
const ANDROID_CLIENT_ID = process.env.EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID ?? '';

function isConfigured() {
  if (Platform.OS === 'ios') return !!IOS_CLIENT_ID;
  if (Platform.OS === 'android') return !!ANDROID_CLIENT_ID;
  return !!WEB_CLIENT_ID;
}

interface Props {
  disabled?: boolean;
  onToken: (accessToken: string) => void;
  label?: string;
}

// Inner component — the hook only runs when this component is mounted,
// which only happens when the platform-specific client ID is present.
function GoogleButtonInner({ disabled, onToken, label }: Props) {
  const [, response, promptAsync] = Google.useAuthRequest({
    clientId: WEB_CLIENT_ID || undefined,
    iosClientId: IOS_CLIENT_ID || undefined,
    androidClientId: ANDROID_CLIENT_ID || undefined,
  });

  const handleToken = useCallback((token: string) => onToken(token), [onToken]);

  useEffect(() => {
    if (response?.type === 'success') {
      const token = response.authentication?.accessToken;
      if (token) handleToken(token);
    }
  }, [response, handleToken]);

  return (
    <Pressable style={styles.btn} onPress={() => promptAsync()} disabled={disabled}>
      <Text style={styles.text}>{label}</Text>
    </Pressable>
  );
}

// Public export: only mounts the inner component (and thus the hook) when
// the platform has a configured client ID.
export function GoogleSignInButton(props: Props) {
  if (!isConfigured()) return null;
  return <GoogleButtonInner {...props} label={props.label ?? 'Continue with Google'} />;
}

const styles = StyleSheet.create({
  btn: {
    borderRadius: radii.sm,
    borderWidth: 1.5,
    borderColor: colors.line,
    paddingVertical: 14,
    alignItems: 'center',
    backgroundColor: colors.card,
  },
  text: { fontFamily: fonts.sansMedium, fontSize: 14.5, color: colors.ink },
});

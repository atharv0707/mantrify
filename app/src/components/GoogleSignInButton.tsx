import React, { useCallback, useEffect } from 'react';
import { Alert, Platform, Pressable, StyleSheet, Text } from 'react-native';
import * as WebBrowser from 'expo-web-browser';
import * as Google from 'expo-auth-session/providers/google';
import { colors, radii } from '../theme/colors';
import { fonts } from '../theme/typography';

WebBrowser.maybeCompleteAuthSession();

const WEB_CLIENT_ID = process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID ?? '';
const IOS_CLIENT_ID = process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID ?? '';
const ANDROID_CLIENT_ID = process.env.EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID ?? '';

function platformClientId() {
  if (Platform.OS === 'ios') return IOS_CLIENT_ID;
  if (Platform.OS === 'android') return ANDROID_CLIENT_ID;
  return WEB_CLIENT_ID;
}

interface Props {
  disabled?: boolean;
  onToken: (accessToken: string) => void;
  label?: string;
}

// Inner component — the useAuthRequest hook only runs when this mounts,
// which only happens when the platform client ID is actually set.
function GoogleButtonConfigured({ disabled, onToken, label }: Props) {
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
    <Pressable style={[styles.btn, disabled && styles.btnDisabled]} onPress={() => promptAsync()} disabled={disabled}>
      <Text style={styles.text}>{label ?? 'Continue with Google'}</Text>
    </Pressable>
  );
}

// Fallback shown when no OAuth client IDs are configured.
function GoogleButtonUnconfigured({ label }: Pick<Props, 'label'>) {
  return (
    <Pressable
      style={styles.btn}
      onPress={() =>
        Alert.alert(
          'Google Sign-In Not Configured',
          'Add your Google OAuth client IDs to the app .env file:\n\nEXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID\nEXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID\nEXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID',
          [{ text: 'OK' }]
        )
      }
    >
      <Text style={[styles.text, styles.textMuted]}>{label ?? 'Continue with Google'}</Text>
    </Pressable>
  );
}

export function GoogleSignInButton(props: Props) {
  if (platformClientId()) {
    return <GoogleButtonConfigured {...props} />;
  }
  return <GoogleButtonUnconfigured label={props.label} />;
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
  btnDisabled: { opacity: 0.5 },
  text: { fontFamily: fonts.sansMedium, fontSize: 14.5, color: colors.ink },
  textMuted: { color: colors.muted },
});

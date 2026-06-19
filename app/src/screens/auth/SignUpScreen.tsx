import React, { useState } from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as WebBrowser from 'expo-web-browser';
import * as Google from 'expo-auth-session/providers/google';
import * as AppleAuthentication from 'expo-apple-authentication';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { authApi } from '../../api/client';
import { useAuth } from '../../auth/AuthContext';
import { colors, radii } from '../../theme/colors';
import { fonts } from '../../theme/typography';
import type { AuthStackParamList } from '../../navigation/types';

WebBrowser.maybeCompleteAuthSession();

type Nav = NativeStackNavigationProp<AuthStackParamList, 'SignUp'>;

const GOOGLE_CLIENT_ID = process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID ?? '';
const GOOGLE_IOS_CLIENT_ID = process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID ?? '';
const GOOGLE_ANDROID_CLIENT_ID = process.env.EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID ?? '';

export default function SignUpScreen() {
  const navigation = useNavigation<Nav>();
  const { signIn } = useAuth();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const [, googleResponse, promptGoogleAsync] = Google.useAuthRequest({
    clientId: GOOGLE_CLIENT_ID || undefined,
    iosClientId: GOOGLE_IOS_CLIENT_ID || undefined,
    androidClientId: GOOGLE_ANDROID_CLIENT_ID || undefined,
  });

  React.useEffect(() => {
    if (googleResponse?.type === 'success') {
      const accessToken = googleResponse.authentication?.accessToken;
      if (accessToken) handleGoogleToken(accessToken);
    }
  }, [googleResponse]);

  async function handleGoogleToken(accessToken: string) {
    setLoading(true);
    setError(null);
    try {
      const res = await authApi.googleSignIn(accessToken);
      await signIn(res);
    } catch {
      setError('Google sign-in failed. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  async function handleSignUp() {
    if (!name.trim()) return setError('Please enter your name.');
    if (!email.trim()) return setError('Please enter your email.');
    if (password.length < 8) return setError('Password must be at least 8 characters.');
    if (password !== confirmPassword) return setError('Passwords do not match.');
    setLoading(true);
    setError(null);
    try {
      await authApi.signup({ name: name.trim(), email: email.trim().toLowerCase(), password });
      navigation.navigate('VerifyEmail', { email: email.trim().toLowerCase() });
    } catch (e: any) {
      if (e.code === 'email_taken') {
        setError('An account with this email already exists.');
      } else {
        setError('Something went wrong. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  }

  async function handleApple() {
    setLoading(true);
    setError(null);
    try {
      const credential = await AppleAuthentication.signInAsync({
        requestedScopes: [
          AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
          AppleAuthentication.AppleAuthenticationScope.EMAIL,
        ],
      });
      const res = await authApi.appleSignIn({
        identityToken: credential.identityToken!,
        fullName: credential.fullName,
      });
      await signIn(res);
    } catch (e: any) {
      if (e.code !== 'ERR_REQUEST_CANCELED') {
        setError('Apple sign-in failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
          <Pressable style={styles.back} onPress={() => navigation.goBack()}>
            <Text style={styles.backText}>← Back</Text>
          </Pressable>

          <View style={styles.header}>
            <Text style={styles.title}>Create account</Text>
            <Text style={styles.subtitle}>Join your daily spiritual practice</Text>
          </View>

          {error && <View style={styles.errorBox}><Text style={styles.errorText}>{error}</Text></View>}

          <View style={styles.form}>
            <Text style={styles.label}>Full name</Text>
            <TextInput
              style={styles.input}
              value={name}
              onChangeText={setName}
              placeholder="Aarav Sharma"
              placeholderTextColor={colors.faint}
              autoCapitalize="words"
              autoComplete="name"
              returnKeyType="next"
            />

            <Text style={[styles.label, { marginTop: 16 }]}>Email</Text>
            <TextInput
              style={styles.input}
              value={email}
              onChangeText={setEmail}
              placeholder="you@example.com"
              placeholderTextColor={colors.faint}
              autoCapitalize="none"
              keyboardType="email-address"
              autoComplete="email"
              returnKeyType="next"
            />

            <Text style={[styles.label, { marginTop: 16 }]}>Password</Text>
            <TextInput
              style={styles.input}
              value={password}
              onChangeText={setPassword}
              placeholder="Minimum 8 characters"
              placeholderTextColor={colors.faint}
              secureTextEntry
              autoComplete="new-password"
              returnKeyType="next"
            />

            <Text style={[styles.label, { marginTop: 16 }]}>Confirm password</Text>
            <TextInput
              style={styles.input}
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              placeholder="••••••••"
              placeholderTextColor={colors.faint}
              secureTextEntry
              returnKeyType="done"
              onSubmitEditing={handleSignUp}
            />

            <Pressable style={styles.primaryBtn} onPress={handleSignUp} disabled={loading}>
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.primaryBtnText}>Create Account</Text>
              )}
            </Pressable>
          </View>

          <View style={styles.divider}>
            <View style={styles.divLine} />
            <Text style={styles.divText}>or continue with</Text>
            <View style={styles.divLine} />
          </View>

          <Pressable
            style={styles.ssoBtn}
            onPress={() => promptGoogleAsync()}
            disabled={loading || !GOOGLE_CLIENT_ID}
          >
            <Text style={styles.ssoBtnText}>Continue with Google</Text>
          </Pressable>

          {Platform.OS === 'ios' && (
            <AppleAuthentication.AppleAuthenticationButton
              buttonType={AppleAuthentication.AppleAuthenticationButtonType.SIGN_UP}
              buttonStyle={AppleAuthentication.AppleAuthenticationButtonStyle.BLACK}
              cornerRadius={radii.sm}
              style={styles.appleBtn}
              onPress={handleApple}
            />
          )}

          <View style={styles.footer}>
            <Text style={styles.footerText}>Already have an account? </Text>
            <Pressable onPress={() => navigation.navigate('SignIn')}>
              <Text style={[styles.footerText, styles.link]}>Sign In</Text>
            </Pressable>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.paper },
  scroll: { flexGrow: 1, paddingHorizontal: 24, paddingTop: 24, paddingBottom: 40 },
  back: { marginBottom: 24 },
  backText: { fontFamily: fonts.sansMedium, fontSize: 14, color: colors.muted },
  header: { marginBottom: 32 },
  title: { fontFamily: fonts.serif, fontSize: 26, color: colors.ink },
  subtitle: { fontFamily: fonts.sans, fontSize: 14, color: colors.muted, marginTop: 4 },
  errorBox: { backgroundColor: '#fdecea', borderRadius: radii.sm, padding: 12, marginBottom: 16 },
  errorText: { fontFamily: fonts.sans, fontSize: 13, color: '#b71c1c' },
  form: { gap: 4 },
  label: { fontFamily: fonts.sansMedium, fontSize: 13, color: colors.muted, marginBottom: 6 },
  input: {
    backgroundColor: colors.card,
    borderRadius: radii.sm,
    borderWidth: 1,
    borderColor: colors.line,
    paddingHorizontal: 14,
    paddingVertical: 13,
    fontFamily: fonts.sans,
    fontSize: 15,
    color: colors.ink,
  },
  primaryBtn: {
    backgroundColor: colors.saffron,
    borderRadius: radii.sm,
    paddingVertical: 15,
    alignItems: 'center',
    marginTop: 24,
  },
  primaryBtnText: { fontFamily: fonts.sansSemiBold, fontSize: 15, color: '#fff' },
  divider: { flexDirection: 'row', alignItems: 'center', gap: 10, marginVertical: 28 },
  divLine: { flex: 1, height: 1, backgroundColor: colors.line },
  divText: { fontFamily: fonts.sans, fontSize: 12, color: colors.faint },
  ssoBtn: {
    borderRadius: radii.sm,
    borderWidth: 1.5,
    borderColor: colors.line,
    paddingVertical: 14,
    alignItems: 'center',
    backgroundColor: colors.card,
  },
  ssoBtnText: { fontFamily: fonts.sansMedium, fontSize: 14.5, color: colors.ink },
  appleBtn: { height: 50, marginTop: 12 },
  footer: { flexDirection: 'row', justifyContent: 'center', marginTop: 32, flexWrap: 'wrap' },
  footerText: { fontFamily: fonts.sans, fontSize: 14, color: colors.muted },
  link: { color: colors.saffronDeep, fontFamily: fonts.sansSemiBold },
});

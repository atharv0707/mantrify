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
import * as AppleAuthentication from 'expo-apple-authentication';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { authApi } from '../../api/client';
import { useAuth } from '../../auth/AuthContext';
import { GoogleSignInButton } from '../../components/GoogleSignInButton';
import { colors, radii } from '../../theme/colors';
import { fonts } from '../../theme/typography';
import type { AuthStackParamList } from '../../navigation/types';

type Nav = NativeStackNavigationProp<AuthStackParamList, 'SignIn'>;

export default function SignInScreen() {
  const navigation = useNavigation<Nav>();
  const { signIn } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

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

  async function handleSignIn() {
    if (!email.trim() || !password) return;
    setLoading(true);
    setError(null);
    try {
      const res = await authApi.signin({ email: email.trim(), password });
      await signIn(res);
    } catch (e: any) {
      if (e.code === 'email_not_verified') {
        navigation.navigate('VerifyEmail', { email: email.trim() });
      } else if (e.code === 'invalid_credentials') {
        setError('Incorrect email or password.');
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
          <View style={styles.header}>
            <Text style={styles.brand}>Mantrify</Text>
            <Text style={styles.subtitle}>Your daily spiritual companion</Text>
          </View>

          {error && <View style={styles.errorBox}><Text style={styles.errorText}>{error}</Text></View>}

          <View style={styles.form}>
            <Text style={styles.label}>Email</Text>
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
              placeholder="••••••••"
              placeholderTextColor={colors.faint}
              secureTextEntry
              autoComplete="password"
              returnKeyType="done"
              onSubmitEditing={handleSignIn}
            />

            <Pressable style={styles.primaryBtn} onPress={handleSignIn} disabled={loading}>
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.primaryBtnText}>Sign In</Text>
              )}
            </Pressable>

            <Pressable
              style={styles.linkRow}
              onPress={() => navigation.navigate('ForgotPassword', { email: email.trim() })}
            >
              <Text style={styles.link}>Forgot password?</Text>
            </Pressable>
          </View>

          <View style={styles.divider}>
            <View style={styles.divLine} />
            <Text style={styles.divText}>or continue with</Text>
            <View style={styles.divLine} />
          </View>

          <GoogleSignInButton onToken={handleGoogleToken} disabled={loading} />

          {Platform.OS === 'ios' && (
            <AppleAuthentication.AppleAuthenticationButton
              buttonType={AppleAuthentication.AppleAuthenticationButtonType.SIGN_IN}
              buttonStyle={AppleAuthentication.AppleAuthenticationButtonStyle.BLACK}
              cornerRadius={radii.sm}
              style={styles.appleBtn}
              onPress={handleApple}
            />
          )}

          <View style={styles.footer}>
            <Text style={styles.footerText}>Don't have an account? </Text>
            <Pressable onPress={() => navigation.navigate('SignUp')}>
              <Text style={[styles.footerText, styles.link]}>Sign Up</Text>
            </Pressable>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.paper },
  scroll: { flexGrow: 1, paddingHorizontal: 24, paddingTop: 40, paddingBottom: 40 },
  header: { alignItems: 'center', marginBottom: 40 },
  brand: { fontFamily: fonts.serif, fontSize: 32, color: colors.ink, letterSpacing: -0.5 },
  subtitle: { fontFamily: fonts.sans, fontSize: 14, color: colors.muted, marginTop: 6 },
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
  linkRow: { alignItems: 'center', marginTop: 12 },
  link: { color: colors.saffronDeep, fontFamily: fonts.sansSemiBold },
  divider: { flexDirection: 'row', alignItems: 'center', gap: 10, marginVertical: 28 },
  divLine: { flex: 1, height: 1, backgroundColor: colors.line },
  divText: { fontFamily: fonts.sans, fontSize: 12, color: colors.faint },
  appleBtn: { height: 50, marginTop: 12 },
  footer: { flexDirection: 'row', justifyContent: 'center', marginTop: 32, flexWrap: 'wrap' },
  footerText: { fontFamily: fonts.sans, fontSize: 14, color: colors.muted },
});

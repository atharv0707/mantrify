import React, { useRef, useState } from 'react';
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
import { useNavigation, useRoute } from '@react-navigation/native';
import type { NativeStackNavigationProp, NativeStackScreenProps } from '@react-navigation/native-stack';
import { authApi } from '../../api/client';
import { useAuth } from '../../auth/AuthContext';
import { colors, radii } from '../../theme/colors';
import { fonts } from '../../theme/typography';
import type { AuthStackParamList } from '../../navigation/types';

type Nav = NativeStackNavigationProp<AuthStackParamList, 'VerifyEmail'>;
type Route = NativeStackScreenProps<AuthStackParamList, 'VerifyEmail'>['route'];

export default function VerifyEmailScreen() {
  const navigation = useNavigation<Nav>();
  const route = useRoute<Route>();
  const { email } = route.params;
  const { signIn } = useAuth();

  const [digits, setDigits] = useState<string[]>(['', '', '', '', '', '']);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [resendDone, setResendDone] = useState(false);
  const inputRefs = useRef<(TextInput | null)[]>([]);

  function handleDigit(val: string, idx: number) {
    const digit = val.replace(/\D/g, '').slice(-1);
    const next = [...digits];
    next[idx] = digit;
    setDigits(next);
    if (digit && idx < 5) {
      inputRefs.current[idx + 1]?.focus();
    }
    if (next.every((d) => d)) {
      verifyCode(next.join(''));
    }
  }

  function handleKeyPress(key: string, idx: number) {
    if (key === 'Backspace' && !digits[idx] && idx > 0) {
      inputRefs.current[idx - 1]?.focus();
    }
  }

  async function verifyCode(code: string) {
    setLoading(true);
    setError(null);
    try {
      const res = await authApi.verifyEmail({ email, code });
      await signIn(res);
    } catch (e: any) {
      setError('Invalid or expired code. Please try again.');
      setDigits(['', '', '', '', '', '']);
      inputRefs.current[0]?.focus();
    } finally {
      setLoading(false);
    }
  }

  async function handleResend() {
    try {
      await authApi.resendVerification(email);
      setResendDone(true);
    } catch {}
  }

  const canVerify = digits.every((d) => d) && !loading;

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
          <Pressable style={styles.back} onPress={() => navigation.goBack()}>
            <Text style={styles.backText}>← Back</Text>
          </Pressable>

          <View style={styles.iconRow}>
            <Text style={styles.icon}>📬</Text>
          </View>

          <Text style={styles.title}>Check your email</Text>
          <Text style={styles.subtitle}>
            We sent a 6-digit code to{'\n'}
            <Text style={styles.emailText}>{email}</Text>
          </Text>

          {error && <View style={styles.errorBox}><Text style={styles.errorText}>{error}</Text></View>}

          <View style={styles.otpRow}>
            {digits.map((d, idx) => (
              <TextInput
                key={idx}
                ref={(r) => { inputRefs.current[idx] = r; }}
                style={[styles.otpInput, d ? styles.otpInputFilled : null]}
                value={d}
                onChangeText={(val) => handleDigit(val, idx)}
                onKeyPress={({ nativeEvent }) => handleKeyPress(nativeEvent.key, idx)}
                keyboardType="number-pad"
                maxLength={1}
                selectTextOnFocus
                caretHidden
              />
            ))}
          </View>

          <Pressable
            style={[styles.primaryBtn, !canVerify && styles.primaryBtnDisabled]}
            onPress={() => verifyCode(digits.join(''))}
            disabled={!canVerify}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.primaryBtnText}>Verify Email</Text>
            )}
          </Pressable>

          <View style={styles.resendRow}>
            <Text style={styles.resendText}>Didn't receive it? </Text>
            {resendDone ? (
              <Text style={styles.resendSent}>Sent!</Text>
            ) : (
              <Pressable onPress={handleResend}>
                <Text style={styles.resendLink}>Resend code</Text>
              </Pressable>
            )}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.paper },
  scroll: { flexGrow: 1, paddingHorizontal: 24, paddingTop: 24, paddingBottom: 40 },
  back: { marginBottom: 32 },
  backText: { fontFamily: fonts.sansMedium, fontSize: 14, color: colors.muted },
  iconRow: { alignItems: 'center', marginBottom: 20 },
  icon: { fontSize: 48 },
  title: { fontFamily: fonts.serif, fontSize: 26, color: colors.ink, textAlign: 'center' },
  subtitle: {
    fontFamily: fonts.sans,
    fontSize: 14,
    color: colors.muted,
    textAlign: 'center',
    marginTop: 10,
    lineHeight: 22,
    marginBottom: 32,
  },
  emailText: { fontFamily: fonts.sansSemiBold, color: colors.ink },
  errorBox: { backgroundColor: '#fdecea', borderRadius: radii.sm, padding: 12, marginBottom: 20 },
  errorText: { fontFamily: fonts.sans, fontSize: 13, color: '#b71c1c', textAlign: 'center' },
  otpRow: { flexDirection: 'row', justifyContent: 'center', gap: 10, marginBottom: 32 },
  otpInput: {
    width: 46,
    height: 56,
    borderRadius: radii.sm,
    borderWidth: 1.5,
    borderColor: colors.line,
    backgroundColor: colors.card,
    textAlign: 'center',
    fontFamily: fonts.sansBold,
    fontSize: 22,
    color: colors.ink,
  },
  otpInputFilled: { borderColor: colors.saffron },
  primaryBtn: {
    backgroundColor: colors.saffron,
    borderRadius: radii.sm,
    paddingVertical: 15,
    alignItems: 'center',
  },
  primaryBtnDisabled: { opacity: 0.5 },
  primaryBtnText: { fontFamily: fonts.sansSemiBold, fontSize: 15, color: '#fff' },
  resendRow: { flexDirection: 'row', justifyContent: 'center', marginTop: 24 },
  resendText: { fontFamily: fonts.sans, fontSize: 14, color: colors.muted },
  resendLink: { fontFamily: fonts.sansSemiBold, fontSize: 14, color: colors.saffronDeep },
  resendSent: { fontFamily: fonts.sansSemiBold, fontSize: 14, color: colors.ok },
});

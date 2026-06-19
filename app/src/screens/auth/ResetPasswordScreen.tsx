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
import { colors, radii } from '../../theme/colors';
import { fonts } from '../../theme/typography';
import type { AuthStackParamList } from '../../navigation/types';

type Nav = NativeStackNavigationProp<AuthStackParamList, 'ResetPassword'>;
type Route = NativeStackScreenProps<AuthStackParamList, 'ResetPassword'>['route'];

export default function ResetPasswordScreen() {
  const navigation = useNavigation<Nav>();
  const route = useRoute<Route>();
  const { email } = route.params;

  const [digits, setDigits] = useState<string[]>(['', '', '', '', '', '']);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const inputRefs = useRef<(TextInput | null)[]>([]);

  function handleDigit(val: string, idx: number) {
    const digit = val.replace(/\D/g, '').slice(-1);
    const next = [...digits];
    next[idx] = digit;
    setDigits(next);
    if (digit && idx < 5) inputRefs.current[idx + 1]?.focus();
  }

  function handleKeyPress(key: string, idx: number) {
    if (key === 'Backspace' && !digits[idx] && idx > 0) inputRefs.current[idx - 1]?.focus();
  }

  async function handleReset() {
    const code = digits.join('');
    if (code.length !== 6) return setError('Please enter the 6-digit code.');
    if (newPassword.length < 8) return setError('Password must be at least 8 characters.');
    if (newPassword !== confirmPassword) return setError('Passwords do not match.');
    setLoading(true);
    setError(null);
    try {
      await authApi.resetPassword({ email, code, newPassword });
      setDone(true);
    } catch {
      setError('Invalid or expired code. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  if (done) {
    return (
      <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
        <ScrollView contentContainerStyle={styles.scroll}>
          <View style={styles.iconRow}><Text style={styles.icon}>✅</Text></View>
          <Text style={styles.title}>Password reset!</Text>
          <Text style={styles.subtitle}>You can now sign in with your new password.</Text>
          <Pressable style={styles.primaryBtn} onPress={() => navigation.navigate('SignIn')}>
            <Text style={styles.primaryBtnText}>Sign In</Text>
          </Pressable>
        </ScrollView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
          <Pressable style={styles.back} onPress={() => navigation.goBack()}>
            <Text style={styles.backText}>← Back</Text>
          </Pressable>
          <Text style={styles.title}>Reset password</Text>
          <Text style={styles.subtitle}>Enter the code sent to {email}, then choose a new password.</Text>

          {error && <View style={styles.errorBox}><Text style={styles.errorText}>{error}</Text></View>}

          <Text style={[styles.label, { marginTop: 24 }]}>Reset code</Text>
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

          <Text style={styles.label}>New password</Text>
          <TextInput
            style={styles.input}
            value={newPassword}
            onChangeText={setNewPassword}
            placeholder="Minimum 8 characters"
            placeholderTextColor={colors.faint}
            secureTextEntry
            autoComplete="new-password"
            returnKeyType="next"
          />

          <Text style={[styles.label, { marginTop: 16 }]}>Confirm new password</Text>
          <TextInput
            style={styles.input}
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            placeholder="••••••••"
            placeholderTextColor={colors.faint}
            secureTextEntry
            returnKeyType="done"
            onSubmitEditing={handleReset}
          />

          <Pressable style={styles.primaryBtn} onPress={handleReset} disabled={loading}>
            {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.primaryBtnText}>Reset Password</Text>}
          </Pressable>
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
  title: { fontFamily: fonts.serif, fontSize: 26, color: colors.ink },
  subtitle: { fontFamily: fonts.sans, fontSize: 14, color: colors.muted, marginTop: 8, lineHeight: 22, marginBottom: 16 },
  errorBox: { backgroundColor: '#fdecea', borderRadius: radii.sm, padding: 12, marginBottom: 16 },
  errorText: { fontFamily: fonts.sans, fontSize: 13, color: '#b71c1c' },
  label: { fontFamily: fonts.sansMedium, fontSize: 13, color: colors.muted, marginBottom: 8 },
  otpRow: { flexDirection: 'row', gap: 10, marginBottom: 24 },
  otpInput: {
    width: 46,
    height: 52,
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
});

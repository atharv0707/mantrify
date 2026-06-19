import React, { useCallback, useState } from 'react';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { ActivityIndicator, Alert, Pressable, StyleSheet, Text, View } from 'react-native';
import { Screen } from '../components/Screen';
import { LanguageToggle } from '../components/LanguageToggle';
import { colors } from '../theme/colors';
import { fonts } from '../theme/typography';
import { api } from '../api/client';
import { useAuth } from '../auth/AuthContext';
import type { Profile } from '../api/types';

export default function ProfileScreen() {
  const navigation = useNavigation<any>();
  const { user, signOut } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);

  const load = useCallback(async () => {
    try {
      const res = await api.getProfile();
      setProfile(res);
    } catch {}
  }, []);

  useFocusEffect(useCallback(() => { load(); }, [load]));

  if (!profile) {
    return (
      <Screen>
        <View style={styles.loading}>
          <ActivityIndicator color={colors.saffron} />
        </View>
      </Screen>
    );
  }

  return (
    <Screen>
      <View style={styles.topbar}>
        <Text style={styles.title}>Profile</Text>
      </View>

      <View style={styles.profHead}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{profile.name[0].toUpperCase()}</Text>
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.name}>{profile.name}</Text>
          {profile.email && <Text style={styles.email}>{profile.email}</Text>}
          <Text style={styles.streak}>🔥 {profile.streak}-day streak</Text>
        </View>
      </View>

      <View style={[styles.setRow, styles.languageRow]}>
        <View style={styles.languageRowTop}>
          <Text style={styles.icon}>🌐</Text>
          <Text style={styles.setLabel}>Language</Text>
        </View>
        <LanguageToggle />
      </View>

      <Pressable style={styles.setRow}>
        <Text style={styles.icon}>🔔</Text>
        <Text style={styles.setLabel}>Reminders</Text>
        <Text style={styles.setValue}>On</Text>
      </Pressable>

      <Pressable style={styles.setRow} onPress={() => navigation.navigate('Favourites')}>
        <Text style={styles.icon}>⭐</Text>
        <Text style={styles.setLabel}>Favourites</Text>
        <Text style={styles.setValue}>{profile.favouritesCount} ›</Text>
      </Pressable>

      <Pressable style={styles.setRow}>
        <Text style={styles.icon}>📿</Text>
        <Text style={styles.setLabel}>History & streaks</Text>
        <Text style={styles.setValue}>›</Text>
      </Pressable>

      {user?.role === 'admin' && (
        <Pressable style={styles.setRow} onPress={() => navigation.navigate('Admin')}>
          <Text style={styles.icon}>⚙️</Text>
          <Text style={styles.setLabel}>Admin Panel</Text>
          <Text style={styles.setValue}>›</Text>
        </Pressable>
      )}

      <Pressable
        style={[styles.setRow, styles.lastRow, styles.signOutRow]}
        onPress={() =>
          Alert.alert('Sign Out', 'Are you sure you want to sign out?', [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Sign Out', style: 'destructive', onPress: signOut },
          ])
        }
      >
        <Text style={styles.icon}>🚪</Text>
        <Text style={[styles.setLabel, styles.signOutLabel]}>Sign Out</Text>
      </Pressable>
    </Screen>
  );
}

const styles = StyleSheet.create({
  loading: { paddingTop: 120, alignItems: 'center' },
  topbar: { paddingVertical: 6, marginBottom: 6 },
  title: { fontFamily: fonts.serif, fontSize: 18, color: colors.ink },
  profHead: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    marginVertical: 18,
  },
  avatar: {
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: colors.indigo,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: { color: '#f3d9a6', fontFamily: fonts.sansBold, fontSize: 22 },
  name: { fontFamily: fonts.serif, fontSize: 19, color: colors.ink },
  email: { fontFamily: fonts.sans, fontSize: 12, color: colors.muted, marginTop: 1 },
  streak: { fontFamily: fonts.sansSemiBold, fontSize: 12.5, color: colors.saffronDeep, marginTop: 3 },
  setRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 15,
    paddingHorizontal: 4,
    borderBottomWidth: 1,
    borderBottomColor: colors.line,
  },
  lastRow: { borderBottomWidth: 0 },
  signOutRow: { marginTop: 8 },
  signOutLabel: { color: '#b71c1c' },
  languageRow: { flexDirection: 'column', alignItems: 'stretch', gap: 10 },
  languageRowTop: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  icon: { width: 20, textAlign: 'center', fontSize: 15 },
  setLabel: { fontFamily: fonts.sansMedium, fontSize: 14, color: colors.ink },
  setValue: { marginLeft: 'auto', fontFamily: fonts.sans, fontSize: 12.5, color: colors.muted },
});

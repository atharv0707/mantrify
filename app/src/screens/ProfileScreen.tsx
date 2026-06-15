import React, { useCallback, useState } from 'react';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';
import { Screen } from '../components/Screen';
import { colors } from '../theme/colors';
import { fonts } from '../theme/typography';
import { api } from '../api/client';
import type { Profile } from '../api/types';

const TRADITION_LABELS: Record<string, string> = {
  vaishnava: 'Vaishnava',
  shaiva: 'Shaiva',
  shakta: 'Shakta',
  smarta: 'Smarta',
};

const REGION_LABELS: Record<string, string> = {
  north: 'North',
  south: 'South',
  east: 'East',
  west: 'West',
  universal: 'Universal',
};

export default function ProfileScreen() {
  const navigation = useNavigation<any>();
  const [profile, setProfile] = useState<Profile | null>(null);

  const load = useCallback(async () => {
    const res = await api.getProfile();
    setProfile(res);
  }, []);

  useFocusEffect(
    useCallback(() => {
      load();
    }, [load])
  );

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
          <Text style={styles.avatarText}>{profile.name[0]}</Text>
        </View>
        <View>
          <Text style={styles.name}>{profile.name}</Text>
          <Text style={styles.streak}>🔥 {profile.streak}-day streak</Text>
        </View>
      </View>

      <Pressable style={styles.setRow}>
        <Text style={styles.icon}>🪔</Text>
        <Text style={styles.setLabel}>Personalisation</Text>
        <Text style={styles.setValue}>
          {TRADITION_LABELS[profile.tradition] ?? profile.tradition} · {REGION_LABELS[profile.region] ?? profile.region}
        </Text>
      </Pressable>
      <Pressable style={styles.setRow}>
        <Text style={styles.icon}>🌐</Text>
        <Text style={styles.setLabel}>Language</Text>
        <Text style={styles.setValue}>{profile.language === 'en' ? 'English' : profile.language}</Text>
      </Pressable>
      <Pressable style={styles.setRow}>
        <Text style={styles.icon}>🔔</Text>
        <Text style={styles.setLabel}>Reminders</Text>
        <Text style={styles.setValue}>On</Text>
      </Pressable>
      <Pressable style={styles.setRow} onPress={() => navigation.navigate('Favorites')}>
        <Text style={styles.icon}>⭐</Text>
        <Text style={styles.setLabel}>Favourites</Text>
        <Text style={styles.setValue}>{profile.favoritesCount} ›</Text>
      </Pressable>
      <Pressable style={[styles.setRow, styles.lastRow]}>
        <Text style={styles.icon}>📿</Text>
        <Text style={styles.setLabel}>History & streaks</Text>
        <Text style={styles.setValue}>›</Text>
      </Pressable>
    </Screen>
  );
}

const styles = StyleSheet.create({
  loading: {
    paddingTop: 120,
    alignItems: 'center',
  },
  topbar: {
    paddingVertical: 6,
    marginBottom: 6,
  },
  title: {
    fontFamily: fonts.serif,
    fontSize: 18,
    color: colors.ink,
  },
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
  avatarText: {
    color: '#f3d9a6',
    fontFamily: fonts.sansBold,
    fontSize: 22,
  },
  name: {
    fontFamily: fonts.serif,
    fontSize: 19,
    color: colors.ink,
  },
  streak: {
    fontFamily: fonts.sansSemiBold,
    fontSize: 12.5,
    color: colors.saffronDeep,
    marginTop: 3,
  },
  setRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 15,
    paddingHorizontal: 4,
    borderBottomWidth: 1,
    borderBottomColor: colors.line,
  },
  lastRow: {
    borderBottomWidth: 0,
  },
  icon: {
    width: 20,
    textAlign: 'center',
    fontSize: 15,
  },
  setLabel: {
    fontFamily: fonts.sansMedium,
    fontSize: 14,
    color: colors.ink,
  },
  setValue: {
    marginLeft: 'auto',
    fontFamily: fonts.sans,
    fontSize: 12.5,
    color: colors.muted,
  },
});

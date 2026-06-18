import React, { useCallback, useState } from 'react';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Screen } from '../components/Screen';
import { TopBar } from '../components/TopBar';
import { Eyebrow } from '../components/Eyebrow';
import { SectionHeader } from '../components/SectionHeader';
import { PracticeRow } from '../components/PracticeRow';
import { colors } from '../theme/colors';
import { fonts } from '../theme/typography';
import { api } from '../api/client';
import { useApp } from '../context/AppContext';
import type { TodayResponse } from '../api/types';
import { formatGregorian, todayStr } from '../utils/date';

export default function TodayScreen() {
  const navigation = useNavigation<any>();
  const { isFavourite, toggleFavourite } = useApp();
  const [data, setData] = useState<TodayResponse | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const load = useCallback(async () => {
    const res = await api.getToday(todayStr());
    setData(res);
  }, []);

  useFocusEffect(
    useCallback(() => {
      load();
    }, [load])
  );

  const onRefresh = async () => {
    setRefreshing(true);
    await load();
    setRefreshing(false);
  };

  const toggleRoutineItem = async (id: number, done: boolean) => {
    if (!data) return;
    setData({
      ...data,
      routine: data.routine.map((r) => (r.id === id ? { ...r, done: !done } : r)),
    });
    await api.setCompletion({ routineItemId: id, date: data.date, done: !done });
  };

  if (!data) {
    return (
      <Screen>
        <View style={styles.loading}>
          <ActivityIndicator color={colors.saffron} />
        </View>
      </Screen>
    );
  }

  const heroPractice = data.recommended[0];

  return (
    <Screen onRefresh={onRefresh} refreshing={refreshing}>
      <TopBar title="Mantrify" showFlame avatarLetter="A" />

      <View style={styles.dateWrap}>
        <Eyebrow>Today</Eyebrow>
        <Text style={styles.greg}>{formatGregorian(data.date)}</Text>
        <Text style={styles.panch}>
          {data.panchang.masa} · {data.panchang.paksha} ·{' '}
          <Text style={styles.panchBold}>{data.panchang.tithi}</Text> · {data.panchang.nakshatra} nakshatra
        </Text>
      </View>

      <Pressable
        onPress={() => heroPractice && navigation.navigate('PracticeGuide', { practiceId: heroPractice.id })}
      >
        <LinearGradient
          colors={[colors.indigoLight, colors.indigo, colors.peacock]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.hero}
        >
          <View style={styles.halo} />
          <Text style={styles.heroEyebrow}>Observance of the day</Text>
          <Text style={styles.heroTitle}>{data.observance.title}</Text>
          <Text style={styles.heroBody}>{data.observance.description}</Text>
          {heroPractice && (
            <View style={styles.cta}>
              <Text style={styles.ctaText}>Begin {heroPractice.title.toLowerCase()} →</Text>
            </View>
          )}
        </LinearGradient>
      </Pressable>

      <SectionHeader title="Recommended today" action="See all" onPressAction={() => navigation.navigate('Main', { screen: 'Explore' })} />
      <View style={styles.stack}>
        {data.recommended.map((practice) => (
          <PracticeRow
            key={practice.id}
            practice={practice}
            onPress={() => navigation.navigate('PracticeGuide', { practiceId: practice.id })}
            isFavourite={isFavourite(practice.id)}
            onToggleFavourite={() => toggleFavourite(practice.id)}
          />
        ))}
        {data.recommended.length === 0 && (
          <Text style={styles.empty}>Nothing extra recommended today — enjoy your routine.</Text>
        )}
      </View>

      <SectionHeader title="My routine" action="Edit" onPressAction={() => navigation.navigate('Main', { screen: 'Routine' })} />
      <View style={styles.stack}>
        {data.routine.map((item) => (
          <Pressable
            key={item.id}
            style={styles.check}
            onPress={() => toggleRoutineItem(item.id, item.done)}
          >
            <View style={[styles.box, item.done && styles.boxDone]}>
              {item.done && <Text style={styles.boxCheck}>✓</Text>}
            </View>
            <View>
              <Text style={[styles.ciTitle, item.done && styles.ciTitleDone]}>{item.title}</Text>
              <Text style={styles.ciSub}>
                {item.done ? 'Done' : item.timeOfDay ?? 'Today'}
              </Text>
            </View>
          </Pressable>
        ))}
        {data.routine.length === 0 && (
          <Text style={styles.empty}>No routine items for today yet.</Text>
        )}
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  loading: {
    paddingTop: 120,
    alignItems: 'center',
  },
  dateWrap: {
    marginTop: 4,
    marginBottom: 14,
  },
  greg: {
    fontFamily: fonts.serif,
    fontSize: 20,
    color: colors.ink,
    marginTop: 6,
  },
  panch: {
    fontFamily: fonts.sans,
    fontSize: 12.5,
    color: colors.muted,
    marginTop: 3,
  },
  panchBold: {
    fontFamily: fonts.sansSemiBold,
    color: colors.ink,
  },
  hero: {
    borderRadius: 24,
    padding: 20,
    paddingBottom: 18,
    overflow: 'hidden',
  },
  halo: {
    position: 'absolute',
    right: -30,
    top: -30,
    width: 170,
    height: 170,
    borderRadius: 85,
    backgroundColor: 'rgba(255,193,94,0.35)',
  },
  heroEyebrow: {
    color: '#f6c879',
    fontFamily: fonts.sansBold,
    fontSize: 10.5,
    letterSpacing: 1.6,
    textTransform: 'uppercase',
  },
  heroTitle: {
    fontFamily: fonts.serif,
    fontSize: 23,
    color: '#fdf3df',
    marginTop: 8,
    marginBottom: 6,
    lineHeight: 27,
  },
  heroBody: {
    fontFamily: fonts.sans,
    fontSize: 12.5,
    lineHeight: 18,
    color: '#e6dcc6',
    marginBottom: 16,
    maxWidth: '90%',
  },
  cta: {
    alignSelf: 'flex-start',
    backgroundColor: colors.saffron,
    borderRadius: 30,
    paddingVertical: 10,
    paddingHorizontal: 15,
  },
  ctaText: {
    color: '#2a1605',
    fontFamily: fonts.sansBold,
    fontSize: 13,
  },
  stack: {
    gap: 11,
  },
  empty: {
    fontFamily: fonts.sans,
    fontSize: 13,
    color: colors.muted,
    paddingVertical: 8,
  },
  check: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 13,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: 16,
    padding: 14,
  },
  box: {
    width: 23,
    height: 23,
    borderRadius: 7,
    borderWidth: 2,
    borderColor: colors.faint,
    alignItems: 'center',
    justifyContent: 'center',
  },
  boxDone: {
    backgroundColor: colors.ok,
    borderColor: colors.ok,
  },
  boxCheck: {
    color: '#fff',
    fontSize: 13,
    fontFamily: fonts.sansBold,
  },
  ciTitle: {
    fontFamily: fonts.sansSemiBold,
    fontSize: 14,
    color: colors.ink,
  },
  ciTitleDone: {
    color: colors.muted,
    textDecorationLine: 'line-through',
  },
  ciSub: {
    fontFamily: fonts.sans,
    fontSize: 11.5,
    color: colors.muted,
    marginTop: 2,
  },
});

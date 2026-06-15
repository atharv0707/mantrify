import React, { useCallback, useEffect, useState } from 'react';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Screen } from '../components/Screen';
import { TopBar } from '../components/TopBar';
import { SectionHeader } from '../components/SectionHeader';
import { PracticeRow } from '../components/PracticeRow';
import { Glyph } from '../components/Glyph';
import { Card } from '../components/Card';
import { colors } from '../theme/colors';
import { fonts } from '../theme/typography';
import { api } from '../api/client';
import type { CalendarResponse, DayDetailResponse } from '../api/types';
import { formatDayMonth, monthLabel, shiftMonth, thisMonthStr, todayStr } from '../utils/date';

const PILLS: { key: keyof CalendarResponse['today']; label: string }[] = [
  { key: 'tithi', label: 'Tithi' },
  { key: 'paksha', label: 'Paksha' },
  { key: 'nakshatra', label: 'Nakshatra' },
  { key: 'masa', label: 'Masa' },
  { key: 'vara', label: 'Vara' },
];

export default function CalendarScreen() {
  const navigation = useNavigation<any>();
  const [month, setMonth] = useState(thisMonthStr());
  const [calendar, setCalendar] = useState<CalendarResponse | null>(null);
  const [selectedDate, setSelectedDate] = useState(todayStr());
  const [dayDetail, setDayDetail] = useState<DayDetailResponse | null>(null);

  const loadMonth = useCallback(async (m: string) => {
    const res = await api.getCalendar(m);
    setCalendar(res);
  }, []);

  const loadDay = useCallback(async (date: string) => {
    const res = await api.getDay(date);
    setDayDetail(res);
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadMonth(month);
    }, [month, loadMonth])
  );

  useEffect(() => {
    loadDay(selectedDate);
  }, [selectedDate, loadDay]);

  if (!calendar) {
    return (
      <Screen>
        <View style={styles.loading}>
          <ActivityIndicator color={colors.saffron} />
        </View>
      </Screen>
    );
  }

  // Mon-first grid; backend dates are 0=Sun..6=Sat
  const firstDayWeekday = (calendar.days[0].weekday + 6) % 7;
  const leadingBlanks = Array.from({ length: firstDayWeekday });

  return (
    <Screen>
      <TopBar title="Calendar" />

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.tithiStrip}
        contentContainerStyle={styles.tithiContent}
      >
        {PILLS.map((p) => (
          <View key={p.key} style={styles.pill}>
            <Text style={styles.pillLabel}>{p.label}</Text>
            <Text style={styles.pillValue}>{calendar.today[p.key]}</Text>
          </View>
        ))}
      </ScrollView>

      <View style={styles.calCard}>
        <View style={styles.calHead}>
          <Pressable style={styles.chev} onPress={() => setMonth((m) => shiftMonth(m, -1))}>
            <Text style={styles.chevText}>‹</Text>
          </Pressable>
          <Text style={styles.monthLabel}>{monthLabel(calendar.month)}</Text>
          <Pressable style={styles.chev} onPress={() => setMonth((m) => shiftMonth(m, 1))}>
            <Text style={styles.chevText}>›</Text>
          </Pressable>
        </View>

        <View style={styles.dow}>
          {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((d, i) => (
            <Text key={i} style={styles.dowText}>{d}</Text>
          ))}
        </View>

        <View style={styles.grid}>
          {leadingBlanks.map((_, i) => (
            <View key={`b${i}`} style={styles.day} />
          ))}
          {calendar.days.map((d) => {
            const isToday = d.date === todayStr();
            const isSelected = d.date === selectedDate;
            const hasFestival = !!d.festival;
            const ekadashi = d.flags.includes('ekadashi');
            const marker = hasFestival || ekadashi;
            return (
              <Pressable key={d.date} style={styles.day} onPress={() => setSelectedDate(d.date)}>
                <View
                  style={[
                    styles.dayInner,
                    isSelected && !isToday && styles.dayInnerSelected,
                    isToday && styles.dayInnerToday,
                  ]}
                >
                  <Text style={[styles.dayText, isToday && styles.dayTextToday]}>{d.day}</Text>
                  <View style={styles.markerSlot}>
                    {marker && (
                      <View
                        style={[
                          styles.dot,
                          hasFestival ? styles.dotFestival : styles.dotEkadashi,
                          isToday && styles.dotOnToday,
                        ]}
                      />
                    )}
                  </View>
                </View>
              </Pressable>
            );
          })}
        </View>
      </View>

      <SectionHeader title={formatDayMonth(selectedDate)} />
      <View style={styles.stack}>
        {dayDetail?.observances.map((obs, i) => (
          <View key={i}>
            <Card style={styles.obsRow}>
              <Glyph glyph={obs.practices[0]?.glyph ?? '🕉'} style={obs.practices[0]?.glyphStyle ?? 'indigo'} />
              <View style={styles.obsText}>
                <Text style={styles.obsTitle}>{obs.title}</Text>
                <Text style={styles.obsSub}>{obs.description}</Text>
              </View>
            </Card>
            {obs.practices.map((p) => (
              <View key={p.id} style={{ marginTop: 8 }}>
                <PracticeRow practice={p} onPress={() => navigation.navigate('PracticeGuide', { practiceId: p.id })} />
              </View>
            ))}
          </View>
        ))}
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  loading: {
    paddingTop: 120,
    alignItems: 'center',
  },
  tithiStrip: {
    marginBottom: 14,
  },
  tithiContent: {
    paddingRight: 8,
  },
  pill: {
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: 13,
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginRight: 8,
    minWidth: 78,
    alignItems: 'center',
  },
  pillLabel: {
    fontFamily: fonts.sansBold,
    fontSize: 9.5,
    letterSpacing: 1,
    textTransform: 'uppercase',
    color: colors.faint,
  },
  pillValue: {
    fontFamily: fonts.sansSemiBold,
    fontSize: 13,
    color: colors.ink,
    marginTop: 3,
  },
  calCard: {
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: 18,
    padding: 12,
  },
  calHead: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  monthLabel: {
    fontFamily: fonts.serif,
    fontSize: 18,
    color: colors.ink,
  },
  chev: {
    width: 30,
    height: 30,
    borderRadius: 9,
    borderWidth: 1,
    borderColor: colors.line,
    backgroundColor: colors.paper,
    alignItems: 'center',
    justifyContent: 'center',
  },
  chevText: {
    color: colors.muted,
    fontSize: 16,
    fontFamily: fonts.sansSemiBold,
  },
  dow: {
    flexDirection: 'row',
    marginBottom: 4,
  },
  dowText: {
    flex: 1,
    textAlign: 'center',
    fontFamily: fonts.sansBold,
    fontSize: 10,
    color: colors.faint,
    paddingBottom: 6,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  day: {
    width: `${100 / 7}%`,
    height: 46,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dayInner: {
    width: 38,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 4,
  },
  dayInnerToday: {
    backgroundColor: colors.indigo,
  },
  dayInnerSelected: {
    backgroundColor: colors.paper2,
  },
  dayText: {
    fontFamily: fonts.sansMedium,
    fontSize: 13.5,
    color: colors.ink,
  },
  dayTextToday: {
    color: '#fdf3df',
    fontFamily: fonts.sansBold,
  },
  markerSlot: {
    height: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 2,
  },
  dot: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
  },
  dotFestival: {
    backgroundColor: colors.saffron,
  },
  dotEkadashi: {
    backgroundColor: colors.peacock,
  },
  dotOnToday: {
    backgroundColor: colors.glow,
  },
  stack: {
    gap: 11,
  },
  obsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 13,
  },
  obsText: {
    flex: 1,
    marginLeft: 13,
  },
  obsTitle: {
    fontFamily: fonts.sansSemiBold,
    fontSize: 14.5,
    color: colors.ink,
  },
  obsSub: {
    fontFamily: fonts.sans,
    fontSize: 12,
    color: colors.muted,
    marginTop: 3,
  },
});

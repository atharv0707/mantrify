import React, { useCallback, useState } from 'react';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';
import { Screen } from '../components/Screen';
import { TopBar } from '../components/TopBar';
import { Eyebrow } from '../components/Eyebrow';
import { Toggle } from '../components/Toggle';
import { colors } from '../theme/colors';
import { fonts } from '../theme/typography';
import { api } from '../api/client';
import type { RoutineItem } from '../api/types';

const DAY_LABELS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

function describeDays(days: number[]) {
  if (days.length === 7) return 'daily';
  return days.map((d) => DAY_LABELS[d]).join(' & ');
}

export default function RoutineScreen() {
  const navigation = useNavigation<any>();
  const [items, setItems] = useState<RoutineItem[] | null>(null);

  const load = useCallback(async () => {
    const res = await api.getRoutine();
    setItems(res.items);
  }, []);

  useFocusEffect(
    useCallback(() => {
      load();
    }, [load])
  );

  const toggleReminder = async (item: RoutineItem) => {
    if (!items) return;
    setItems(items.map((i) => (i.id === item.id ? { ...i, reminder: !i.reminder } : i)));
    await api.updateRoutineItem(item.id, { reminder: !item.reminder });
  };

  if (!items) {
    return (
      <Screen>
        <View style={styles.loading}>
          <ActivityIndicator color={colors.saffron} />
        </View>
      </Screen>
    );
  }

  const morning = items.filter((i) => i.group === 'morning');
  const evening = items.filter((i) => i.group === 'evening');
  const other = items.filter((i) => i.group !== 'morning' && i.group !== 'evening');

  const renderGroup = (label: string, group: RoutineItem[]) => {
    if (group.length === 0) return null;
    return (
      <View key={label}>
        <Eyebrow style={styles.groupLabel}>{label}</Eyebrow>
        <View style={styles.stack}>
          {group.map((item) => (
            <View key={item.id} style={styles.check}>
              <View style={styles.box} />
              <View style={styles.text}>
                <Text style={styles.title}>{item.title}</Text>
                <Text style={styles.subtitle}>
                  {item.timeOfDay ? `${item.timeOfDay} · ` : ''}
                  {describeDays(item.days)}
                </Text>
              </View>
              <Toggle value={item.reminder} onChange={() => toggleReminder(item)} />
            </View>
          ))}
        </View>
      </View>
    );
  };

  return (
    <Screen>
      <TopBar title="My Routine" />
      <Text style={styles.intro}>
        Optional daily practices — not mandatory. Build a rhythm that fits your life and we'll remind you gently.
      </Text>

      {renderGroup('Morning', morning)}
      {renderGroup('Evening', evening)}
      {renderGroup('Other', other)}

      <Pressable style={styles.addButton} onPress={() => navigation.navigate('Main', { screen: 'Explore' })}>
        <Text style={styles.addButtonText}>+ Add a practice</Text>
      </Pressable>
    </Screen>
  );
}

const styles = StyleSheet.create({
  loading: {
    paddingTop: 120,
    alignItems: 'center',
  },
  intro: {
    fontFamily: fonts.sans,
    fontSize: 13,
    color: colors.muted,
    lineHeight: 20,
    marginBottom: 16,
  },
  groupLabel: {
    marginBottom: 10,
    marginTop: 6,
  },
  stack: {
    gap: 11,
    marginBottom: 14,
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
  },
  text: {
    flex: 1,
  },
  title: {
    fontFamily: fonts.sansSemiBold,
    fontSize: 14,
    color: colors.ink,
  },
  subtitle: {
    fontFamily: fonts.sans,
    fontSize: 11.5,
    color: colors.muted,
    marginTop: 2,
  },
  addButton: {
    backgroundColor: colors.saffron,
    borderRadius: 15,
    paddingVertical: 15,
    alignItems: 'center',
    marginTop: 12,
  },
  addButtonText: {
    color: '#2a1605',
    fontFamily: fonts.sansBold,
    fontSize: 14.5,
  },
});

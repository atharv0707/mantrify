import React, { useCallback, useState } from 'react';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import {
  ActivityIndicator,
  Alert,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { Screen } from '../components/Screen';
import { TopBar } from '../components/TopBar';
import { Eyebrow } from '../components/Eyebrow';
import { Toggle } from '../components/Toggle';
import { colors, radii } from '../theme/colors';
import { fonts } from '../theme/typography';
import { api } from '../api/client';
import type { RoutineItem } from '../api/types';

const DAY_LABELS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const GROUPS = ['morning', 'evening', 'other'] as const;

function describeDays(days: number[]) {
  if (days.length === 7) return 'Daily';
  if (days.length === 0) return 'No days selected';
  return days.map((d) => DAY_LABELS[d]).join(', ');
}

interface EditState {
  item: RoutineItem;
  timeOfDay: string;
  group: string;
  days: number[];
}

export default function RoutineScreen() {
  const navigation = useNavigation<any>();
  const [items, setItems] = useState<RoutineItem[] | null>(null);
  const [editing, setEditing] = useState<EditState | null>(null);
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    try {
      const res = await api.getRoutine();
      setItems(res.items);
    } catch {}
  }, []);

  useFocusEffect(useCallback(() => { load(); }, [load]));

  const toggleReminder = async (item: RoutineItem) => {
    if (!items) return;
    const updated = !item.reminder;
    setItems(items.map((i) => (i.id === item.id ? { ...i, reminder: updated } : i)));
    await api.updateRoutineItem(item.id, { reminder: updated });
  };

  const openEdit = (item: RoutineItem) => {
    setEditing({ item, timeOfDay: item.timeOfDay ?? '', group: item.group, days: [...item.days] });
  };

  const saveEdit = async () => {
    if (!editing || !items) return;
    setSaving(true);
    try {
      await api.updateRoutineItem(editing.item.id, {
        timeOfDay: editing.timeOfDay.trim() || undefined,
        days: editing.days,
        titleOverride: undefined,
      });
      // update group requires a separate field; patch locally and re-fetch
      setItems(items.map((i) =>
        i.id === editing.item.id
          ? { ...i, timeOfDay: editing.timeOfDay.trim() || null, days: editing.days, group: editing.group }
          : i
      ));
      setEditing(null);
    } catch {
      Alert.alert('Error', 'Could not save changes.');
    } finally {
      setSaving(false);
    }
  };

  const deleteItem = (item: RoutineItem) => {
    Alert.alert('Remove from routine', `Remove "${item.title}" from your routine?`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Remove',
        style: 'destructive',
        onPress: async () => {
          setItems((prev) => prev?.filter((i) => i.id !== item.id) ?? null);
          await api.deleteRoutineItem(item.id);
        },
      },
    ]);
  };

  const toggleDay = (day: number) => {
    if (!editing) return;
    const has = editing.days.includes(day);
    setEditing({
      ...editing,
      days: has ? editing.days.filter((d) => d !== day) : [...editing.days, day].sort(),
    });
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

  const renderItem = (item: RoutineItem) => (
    <View key={item.id} style={styles.card}>
      <View style={styles.cardMain}>
        <View style={styles.cardText}>
          <Text style={styles.cardTitle}>{item.title}</Text>
          <Text style={styles.cardSub}>
            {item.timeOfDay ? `${item.timeOfDay} · ` : ''}{describeDays(item.days)}
          </Text>
        </View>
        <View style={styles.cardActions}>
          <Toggle value={item.reminder} onChange={() => toggleReminder(item)} />
          <Pressable onPress={() => openEdit(item)} hitSlop={8} style={styles.iconBtn}>
            <Feather name="edit-2" size={15} color={colors.muted} />
          </Pressable>
          <Pressable onPress={() => deleteItem(item)} hitSlop={8} style={styles.iconBtn}>
            <Feather name="trash-2" size={15} color={colors.rose} />
          </Pressable>
        </View>
      </View>
    </View>
  );

  const renderGroup = (label: string, group: RoutineItem[]) => {
    if (group.length === 0) return null;
    return (
      <View key={label}>
        <Eyebrow style={styles.groupLabel}>{label}</Eyebrow>
        <View style={styles.stack}>{group.map(renderItem)}</View>
      </View>
    );
  };

  return (
    <Screen>
      <TopBar title="My Routine" />
      <Text style={styles.intro}>
        Build a rhythm that fits your life — we'll remind you gently.
      </Text>

      {items.length === 0 && (
        <Text style={styles.empty}>No practices in your routine yet. Add one below.</Text>
      )}

      {renderGroup('Morning', morning)}
      {renderGroup('Evening', evening)}
      {renderGroup('Other', other)}

      <Pressable style={styles.addButton} onPress={() => navigation.navigate('Main', { screen: 'Explore' })}>
        <Feather name="plus" size={16} color="#2a1605" />
        <Text style={styles.addButtonText}>Add a practice</Text>
      </Pressable>

      {/* Edit modal */}
      <Modal visible={!!editing} animationType="slide" transparent presentationStyle="overFullScreen">
        <Pressable style={styles.backdrop} onPress={() => setEditing(null)} />
        <View style={styles.sheet}>
          <View style={styles.sheetHandle} />
          <Text style={styles.sheetTitle}>{editing?.item.title}</Text>

          <Text style={styles.fieldLabel}>Time of day</Text>
          <TextInput
            style={styles.fieldInput}
            value={editing?.timeOfDay ?? ''}
            onChangeText={(v) => editing && setEditing({ ...editing, timeOfDay: v })}
            placeholder="e.g. 6:00 AM"
            placeholderTextColor={colors.faint}
          />

          <Text style={styles.fieldLabel}>Group</Text>
          <View style={styles.segmented}>
            {GROUPS.map((g) => (
              <Pressable
                key={g}
                style={[styles.seg, editing?.group === g && styles.segActive]}
                onPress={() => editing && setEditing({ ...editing, group: g })}
              >
                <Text style={[styles.segText, editing?.group === g && styles.segTextActive]}>
                  {g.charAt(0).toUpperCase() + g.slice(1)}
                </Text>
              </Pressable>
            ))}
          </View>

          <Text style={styles.fieldLabel}>Days</Text>
          <View style={styles.daysRow}>
            {DAY_LABELS.map((label, i) => (
              <Pressable
                key={i}
                style={[styles.dayBtn, editing?.days.includes(i) && styles.dayBtnActive]}
                onPress={() => toggleDay(i)}
              >
                <Text style={[styles.dayText, editing?.days.includes(i) && styles.dayTextActive]}>
                  {label.slice(0, 2)}
                </Text>
              </Pressable>
            ))}
          </View>

          <Pressable style={styles.saveBtn} onPress={saveEdit} disabled={saving}>
            <Text style={styles.saveBtnText}>{saving ? 'Saving…' : 'Save Changes'}</Text>
          </Pressable>
        </View>
      </Modal>
    </Screen>
  );
}

const styles = StyleSheet.create({
  loading: { paddingTop: 120, alignItems: 'center' },
  intro: { fontFamily: fonts.sans, fontSize: 13, color: colors.muted, lineHeight: 20, marginBottom: 16 },
  empty: { fontFamily: fonts.sans, fontSize: 14, color: colors.faint, textAlign: 'center', marginTop: 40, marginBottom: 20 },
  groupLabel: { marginBottom: 10, marginTop: 6 },
  stack: { gap: 10, marginBottom: 14 },
  card: {
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: radii.md,
    padding: 14,
  },
  cardMain: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  cardText: { flex: 1 },
  cardTitle: { fontFamily: fonts.sansSemiBold, fontSize: 14, color: colors.ink },
  cardSub: { fontFamily: fonts.sans, fontSize: 11.5, color: colors.muted, marginTop: 2 },
  cardActions: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  iconBtn: { padding: 6 },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: colors.saffron,
    borderRadius: 15,
    paddingVertical: 15,
    marginTop: 12,
  },
  addButtonText: { color: '#2a1605', fontFamily: fonts.sansBold, fontSize: 14.5 },
  // Modal
  backdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.35)' },
  sheet: {
    backgroundColor: colors.paper,
    borderTopLeftRadius: 22,
    borderTopRightRadius: 22,
    padding: 24,
    paddingBottom: 40,
  },
  sheetHandle: {
    width: 38, height: 4, borderRadius: 2, backgroundColor: colors.line,
    alignSelf: 'center', marginBottom: 20,
  },
  sheetTitle: { fontFamily: fonts.serif, fontSize: 18, color: colors.ink, marginBottom: 20 },
  fieldLabel: { fontFamily: fonts.sansMedium, fontSize: 12, color: colors.muted, marginBottom: 6 },
  fieldInput: {
    backgroundColor: colors.card,
    borderRadius: radii.sm,
    borderWidth: 1,
    borderColor: colors.line,
    paddingHorizontal: 14,
    paddingVertical: 11,
    fontFamily: fonts.sans,
    fontSize: 15,
    color: colors.ink,
    marginBottom: 18,
  },
  segmented: { flexDirection: 'row', gap: 8, marginBottom: 18 },
  seg: {
    flex: 1, borderRadius: radii.sm, borderWidth: 1, borderColor: colors.line,
    paddingVertical: 9, alignItems: 'center', backgroundColor: colors.card,
  },
  segActive: { backgroundColor: colors.saffron, borderColor: colors.saffron },
  segText: { fontFamily: fonts.sansMedium, fontSize: 13, color: colors.muted },
  segTextActive: { color: '#fff' },
  daysRow: { flexDirection: 'row', gap: 6, marginBottom: 24 },
  dayBtn: {
    flex: 1, borderRadius: 8, borderWidth: 1, borderColor: colors.line,
    paddingVertical: 8, alignItems: 'center', backgroundColor: colors.card,
  },
  dayBtnActive: { backgroundColor: colors.indigo, borderColor: colors.indigo },
  dayText: { fontFamily: fonts.sansMedium, fontSize: 11, color: colors.muted },
  dayTextActive: { color: '#f3d9a6' },
  saveBtn: {
    backgroundColor: colors.saffron, borderRadius: radii.sm,
    paddingVertical: 15, alignItems: 'center',
  },
  saveBtnText: { fontFamily: fonts.sansSemiBold, fontSize: 15, color: '#fff' },
});

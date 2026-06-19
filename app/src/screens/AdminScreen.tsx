import React, { useCallback, useState } from 'react';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import {
  ActivityIndicator,
  Alert,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { Screen } from '../components/Screen';
import { colors, radii } from '../theme/colors';
import { fonts } from '../theme/typography';
import { getAccessToken, BASE_URL } from '../api/client';
import type { PracticeSummary } from '../api/types';

async function adminRequest<T>(path: string, options: RequestInit = {}): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${getAccessToken()}`,
      ...(options.headers as Record<string, string> | undefined),
    },
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({})) as any;
    throw Object.assign(new Error(body.error ?? res.status), { code: body.error, status: res.status });
  }
  return res.json();
}

export default function AdminScreen() {
  const navigation = useNavigation<any>();
  const [practices, setPractices] = useState<PracticeSummary[] | null>(null);
  const [search, setSearch] = useState('');

  const load = useCallback(async () => {
    try {
      const res = await adminRequest<{ practices: PracticeSummary[] }>('/v1/admin/practices');
      setPractices(res.practices);
    } catch {
      Alert.alert('Error', 'Could not load practices. Make sure you are signed in as admin.');
    }
  }, []);

  useFocusEffect(useCallback(() => { load(); }, [load]));

  const deletePractice = (p: PracticeSummary) => {
    Alert.alert('Delete practice', `Delete "${p.title}"? This cannot be undone.`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          try {
            await adminRequest(`/v1/admin/practices/${p.id}`, { method: 'DELETE' });
            setPractices((prev) => prev?.filter((x) => x.id !== p.id) ?? null);
          } catch {
            Alert.alert('Error', 'Could not delete practice.');
          }
        },
      },
    ]);
  };

  const filtered = (practices ?? []).filter((p) =>
    search ? p.title.toLowerCase().includes(search.toLowerCase()) || p.deity?.toLowerCase().includes(search.toLowerCase()) : true
  );

  return (
    <Screen>
      <View style={styles.topbar}>
        <Pressable onPress={() => navigation.goBack()} hitSlop={8} style={styles.backBtn}>
          <Feather name="chevron-left" size={16} color={colors.muted} />
          <Text style={styles.backText}>Profile</Text>
        </Pressable>
        <Text style={styles.title}>Admin Panel</Text>
        <Pressable
          style={styles.newBtn}
          onPress={() => navigation.navigate('AdminPracticeEdit', {})}
        >
          <Feather name="plus" size={16} color="#fff" />
          <Text style={styles.newBtnText}>New</Text>
        </Pressable>
      </View>

      <TextInput
        style={styles.search}
        value={search}
        onChangeText={setSearch}
        placeholder="Search practices…"
        placeholderTextColor={colors.faint}
        clearButtonMode="while-editing"
      />

      {!practices ? (
        <View style={styles.loading}>
          <ActivityIndicator color={colors.saffron} />
        </View>
      ) : (
        <>
          <Text style={styles.count}>{filtered.length} practices</Text>
          {filtered.map((p) => (
            <View key={p.id} style={styles.row}>
              <View style={styles.rowLeft}>
                <Text style={styles.glyph}>{p.glyph}</Text>
                <View style={styles.rowText}>
                  <Text style={styles.rowTitle} numberOfLines={1}>{p.title}</Text>
                  <Text style={styles.rowSub}>{p.type} · {p.deity ?? '—'}</Text>
                </View>
              </View>
              <View style={styles.rowActions}>
                <Pressable
                  onPress={() => navigation.navigate('AdminPracticeEdit', { practiceId: p.id })}
                  hitSlop={8}
                  style={styles.actionBtn}
                >
                  <Feather name="edit-2" size={15} color={colors.muted} />
                </Pressable>
                <Pressable onPress={() => deletePractice(p)} hitSlop={8} style={styles.actionBtn}>
                  <Feather name="trash-2" size={15} color={colors.rose} />
                </Pressable>
              </View>
            </View>
          ))}
        </>
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  topbar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    marginBottom: 12,
    gap: 8,
  },
  backBtn: { flexDirection: 'row', alignItems: 'center', gap: 2 },
  backText: { fontFamily: fonts.sansSemiBold, fontSize: 13, color: colors.muted },
  title: { fontFamily: fonts.serif, fontSize: 18, color: colors.ink, flex: 1, textAlign: 'center' },
  newBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: colors.saffron,
    borderRadius: radii.sm,
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  newBtnText: { fontFamily: fonts.sansSemiBold, fontSize: 13, color: '#fff' },
  search: {
    backgroundColor: colors.card,
    borderRadius: radii.sm,
    borderWidth: 1,
    borderColor: colors.line,
    paddingHorizontal: 14,
    paddingVertical: 11,
    fontFamily: fonts.sans,
    fontSize: 14,
    color: colors.ink,
    marginBottom: 12,
  },
  loading: { paddingTop: 80, alignItems: 'center' },
  count: { fontFamily: fonts.sans, fontSize: 12, color: colors.faint, marginBottom: 10 },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: radii.md,
    padding: 12,
    marginBottom: 8,
    gap: 10,
  },
  rowLeft: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: 10 },
  glyph: { fontSize: 22 },
  rowText: { flex: 1 },
  rowTitle: { fontFamily: fonts.sansSemiBold, fontSize: 14, color: colors.ink },
  rowSub: { fontFamily: fonts.sans, fontSize: 11.5, color: colors.muted, marginTop: 1 },
  rowActions: { flexDirection: 'row', gap: 4 },
  actionBtn: { padding: 6 },
});

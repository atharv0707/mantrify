import React, { useEffect, useState } from 'react';
import { useNavigation, useRoute } from '@react-navigation/native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import {
  ActivityIndicator,
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { getAccessToken, BASE_URL } from '../api/client';
import { colors, radii } from '../theme/colors';
import { fonts } from '../theme/typography';
import type { RootStackParamList } from '../navigation/types';

type Route = NativeStackScreenProps<RootStackParamList, 'AdminPracticeEdit'>['route'];

const TYPES = ['puja', 'mantra', 'aarti', 'chalisa', 'stotra', 'vrat', 'sankalpa'];
const DIFFICULTIES = ['beginner', 'intermediate', 'advanced'];
const GLYPH_STYLES = ['default', 'indigo', 'peacock', 'rose'];

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

interface FormState {
  id: string;
  title: string;
  type: string;
  deity: string;
  glyph: string;
  glyphStyle: string;
  difficulty: string;
  estDurationMin: string;
  summary: string;
  why: string;
  occasions: string;       // comma-separated
  traditionTags: string;   // comma-separated
  regionTags: string;      // comma-separated
  materials: string;       // comma-separated
}

const EMPTY: FormState = {
  id: '', title: '', type: 'puja', deity: '', glyph: '🕉️', glyphStyle: 'default',
  difficulty: 'beginner', estDurationMin: '5', summary: '', why: '',
  occasions: '', traditionTags: '', regionTags: '', materials: '',
};

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <View style={fStyles.field}>
      <Text style={fStyles.label}>{label}</Text>
      {children}
    </View>
  );
}

function Chips({ options, value, onSelect }: { options: string[]; value: string; onSelect: (v: string) => void }) {
  return (
    <View style={fStyles.chips}>
      {options.map((o) => (
        <Pressable key={o} style={[fStyles.chip, value === o && fStyles.chipActive]} onPress={() => onSelect(o)}>
          <Text style={[fStyles.chipText, value === o && fStyles.chipTextActive]}>{o}</Text>
        </Pressable>
      ))}
    </View>
  );
}

const fStyles = StyleSheet.create({
  field: { marginBottom: 18 },
  label: { fontFamily: fonts.sansMedium, fontSize: 12, color: colors.muted, marginBottom: 6 },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip: {
    borderRadius: 20, borderWidth: 1, borderColor: colors.line,
    paddingVertical: 6, paddingHorizontal: 12, backgroundColor: colors.card,
  },
  chipActive: { backgroundColor: colors.saffron, borderColor: colors.saffron },
  chipText: { fontFamily: fonts.sansMedium, fontSize: 12, color: colors.muted },
  chipTextActive: { color: '#fff' },
});

export default function AdminPracticeEditScreen() {
  const navigation = useNavigation<any>();
  const route = useRoute<Route>();
  const { practiceId } = route.params ?? {};
  const isNew = !practiceId;

  const [form, setForm] = useState<FormState>(EMPTY);
  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!practiceId) return;
    (async () => {
      try {
        const res = await adminRequest<{ practices: any[] }>('/v1/admin/practices');
        const p = res.practices.find((x) => x.id === practiceId);
        if (p) {
          setForm({
            id: p.id,
            title: p.title ?? '',
            type: p.type ?? 'puja',
            deity: p.deity ?? '',
            glyph: p.glyph ?? '🕉️',
            glyphStyle: p.glyphStyle ?? 'default',
            difficulty: p.difficulty ?? 'beginner',
            estDurationMin: String(p.estDurationMin ?? 5),
            summary: p.summary ?? '',
            why: p.why ?? '',
            occasions: (p.occasions ?? []).join(', '),
            traditionTags: (p.traditionTags ?? []).join(', '),
            regionTags: (p.regionTags ?? []).join(', '),
            materials: (p.materials ?? []).join(', '),
          });
        }
      } catch {
        Alert.alert('Error', 'Could not load practice.');
      } finally {
        setLoading(false);
      }
    })();
  }, [practiceId]);

  const set = (key: keyof FormState) => (val: string) => setForm((f) => ({ ...f, [key]: val }));

  const save = async () => {
    if (!form.title.trim()) return Alert.alert('Validation', 'Title is required.');
    if (!form.id.trim() && isNew) return Alert.alert('Validation', 'ID is required (lowercase, hyphens only).');

    const csvToArr = (s: string) => s.split(',').map((x) => x.trim()).filter(Boolean);

    const payload = {
      id: form.id.trim(),
      title: form.title.trim(),
      type: form.type,
      deity: form.deity.trim(),
      glyph: form.glyph.trim(),
      glyphStyle: form.glyphStyle,
      difficulty: form.difficulty,
      estDurationMin: parseInt(form.estDurationMin) || 5,
      summary: form.summary.trim(),
      why: form.why.trim(),
      occasions: csvToArr(form.occasions),
      traditionTags: csvToArr(form.traditionTags),
      regionTags: csvToArr(form.regionTags),
      materials: csvToArr(form.materials),
      mantras: [],
      steps: [],
    };

    setSaving(true);
    try {
      if (isNew) {
        await adminRequest('/v1/admin/practices', { method: 'POST', body: JSON.stringify(payload) });
        Alert.alert('Created', `"${payload.title}" added to the library.`);
      } else {
        await adminRequest(`/v1/admin/practices/${practiceId}`, { method: 'PUT', body: JSON.stringify(payload) });
        Alert.alert('Saved', 'Practice updated.');
      }
      navigation.goBack();
    } catch (e: any) {
      Alert.alert('Error', e.code === 'id_taken' ? 'That ID is already taken.' : 'Could not save practice.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.safe} edges={['top']}>
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <ActivityIndicator color={colors.saffron} />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.header}>
        <Pressable onPress={() => navigation.goBack()} hitSlop={8} style={styles.backBtn}>
          <Feather name="chevron-left" size={16} color={colors.muted} />
          <Text style={styles.backText}>Admin</Text>
        </Pressable>
        <Text style={styles.headerTitle}>{isNew ? 'New Practice' : 'Edit Practice'}</Text>
        <Pressable style={styles.saveBtn} onPress={save} disabled={saving}>
          <Text style={styles.saveBtnText}>{saving ? 'Saving…' : 'Save'}</Text>
        </Pressable>
      </View>

      <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
        {isNew && (
          <Field label="ID (unique, lowercase, hyphens — e.g. gayatri-mantra)">
            <TextInput style={styles.input} value={form.id} onChangeText={set('id')}
              placeholder="practice-id" placeholderTextColor={colors.faint} autoCapitalize="none" />
          </Field>
        )}

        <Field label="Title *">
          <TextInput style={styles.input} value={form.title} onChangeText={set('title')}
            placeholder="Gayatri Mantra" placeholderTextColor={colors.faint} />
        </Field>

        <Field label="Type">
          <Chips options={TYPES} value={form.type} onSelect={set('type')} />
        </Field>

        <Field label="Deity / primary deity name (lowercase)">
          <TextInput style={styles.input} value={form.deity} onChangeText={set('deity')}
            placeholder="surya" placeholderTextColor={colors.faint} autoCapitalize="none" />
        </Field>

        <Field label="Glyph emoji">
          <TextInput style={styles.input} value={form.glyph} onChangeText={set('glyph')}
            placeholder="🕉️" placeholderTextColor={colors.faint} />
        </Field>

        <Field label="Glyph style">
          <Chips options={GLYPH_STYLES} value={form.glyphStyle} onSelect={set('glyphStyle')} />
        </Field>

        <Field label="Difficulty">
          <Chips options={DIFFICULTIES} value={form.difficulty} onSelect={set('difficulty')} />
        </Field>

        <Field label="Estimated duration (minutes)">
          <TextInput style={styles.input} value={form.estDurationMin} onChangeText={set('estDurationMin')}
            keyboardType="number-pad" placeholder="5" placeholderTextColor={colors.faint} />
        </Field>

        <Field label="Short summary (1–2 sentences)">
          <TextInput style={[styles.input, styles.multiline]} value={form.summary} onChangeText={set('summary')}
            multiline numberOfLines={3} placeholder="A brief description…" placeholderTextColor={colors.faint} />
        </Field>

        <Field label="Why it matters (longer explanation)">
          <TextInput style={[styles.input, styles.multiline]} value={form.why} onChangeText={set('why')}
            multiline numberOfLines={4} placeholder="Spiritual significance…" placeholderTextColor={colors.faint} />
        </Field>

        <Field label="Occasions (comma-separated, e.g. daily, ekadashi)">
          <TextInput style={styles.input} value={form.occasions} onChangeText={set('occasions')}
            placeholder="daily, festivals" placeholderTextColor={colors.faint} autoCapitalize="none" />
        </Field>

        <Field label="Tradition tags (comma-separated)">
          <TextInput style={styles.input} value={form.traditionTags} onChangeText={set('traditionTags')}
            placeholder="universal, vaishnava" placeholderTextColor={colors.faint} autoCapitalize="none" />
        </Field>

        <Field label="Region tags (comma-separated)">
          <TextInput style={styles.input} value={form.regionTags} onChangeText={set('regionTags')}
            placeholder="universal, north" placeholderTextColor={colors.faint} autoCapitalize="none" />
        </Field>

        <Field label="Materials needed (comma-separated)">
          <TextInput style={styles.input} value={form.materials} onChangeText={set('materials')}
            placeholder="incense, flowers, lamp" placeholderTextColor={colors.faint} />
        </Field>

        <Text style={styles.note}>
          Mantras and steps can be added by editing the seed file or via the API directly.
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.paper },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: colors.line,
    gap: 8,
  },
  backBtn: { flexDirection: 'row', alignItems: 'center', gap: 2 },
  backText: { fontFamily: fonts.sansSemiBold, fontSize: 13, color: colors.muted },
  headerTitle: { flex: 1, textAlign: 'center', fontFamily: fonts.serif, fontSize: 17, color: colors.ink },
  saveBtn: { backgroundColor: colors.saffron, borderRadius: radii.sm, paddingVertical: 6, paddingHorizontal: 14 },
  saveBtnText: { fontFamily: fonts.sansSemiBold, fontSize: 13, color: '#fff' },
  scroll: { padding: 20, paddingBottom: 60 },
  input: {
    backgroundColor: colors.card,
    borderRadius: radii.sm,
    borderWidth: 1,
    borderColor: colors.line,
    paddingHorizontal: 14,
    paddingVertical: 11,
    fontFamily: fonts.sans,
    fontSize: 14,
    color: colors.ink,
  },
  multiline: { minHeight: 80, textAlignVertical: 'top' },
  note: {
    fontFamily: fonts.sans,
    fontSize: 12,
    color: colors.faint,
    textAlign: 'center',
    marginTop: 8,
    lineHeight: 18,
  },
});

import React, { useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { Screen } from '../components/Screen';
import { TopBar } from '../components/TopBar';
import { SectionHeader } from '../components/SectionHeader';
import { Eyebrow } from '../components/Eyebrow';
import { PracticeRow } from '../components/PracticeRow';
import { Glyph } from '../components/Glyph';
import { colors, radii } from '../theme/colors';
import { fonts } from '../theme/typography';
import { api } from '../api/client';
import type { PracticeSummary } from '../api/types';

const OCCASION_CHIPS = [
  { label: '🏠 New house', occasion: 'new-house' },
  { label: '📚 Exams', occasion: 'exams' },
  { label: '🚗 New car', occasion: 'new-car' },
  { label: '✈️ Travel', occasion: 'travel' },
  { label: '🩺 Health', occasion: 'health' },
];

const OCCASION_RAIL = [
  { id: 'griha-pravesh', glyph: '🏠', title: 'Griha Pravesh', subtitle: 'Moving into a new home' },
  { id: 'vidyarambh', glyph: '📖', title: 'Vidyarambh', subtitle: 'Starting studies · Saraswati' },
  { id: 'vahan-puja', glyph: '🚗', title: 'Vahan Puja', subtitle: 'Blessing a new vehicle' },
];

const TYPE_RAIL = [
  { type: 'puja', glyph: '🪔', title: 'Puja', subtitle: 'Ritual worship' },
  { type: 'mantra', glyph: 'ॐ', title: 'Mantra', subtitle: 'Chant & japa' },
  { type: 'aarti', glyph: '🔥', title: 'Aarti', subtitle: 'Ritual of light' },
  { type: 'chalisa', glyph: '📿', title: 'Chalisa', subtitle: '40-verse hymns' },
  { type: 'stotra', glyph: '📜', title: 'Stotra', subtitle: 'Hymns of praise' },
];

const DEITY_RAIL = [
  { deity: 'ganesha', glyph: '🐘', title: 'Ganesha', subtitle: 'New beginnings' },
  { deity: 'lakshmi', glyph: '🪷', title: 'Lakshmi', subtitle: 'Wealth & wellbeing' },
  { deity: 'shiva', glyph: '🔱', title: 'Shiva', subtitle: 'Mondays' },
];

export default function ExploreScreen() {
  const navigation = useNavigation<any>();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<PracticeSummary[] | null>(null);
  const [resultsLabel, setResultsLabel] = useState('');

  const runSearch = async (params: { q?: string; type?: string; deity?: string; occasion?: string }, label: string) => {
    setResultsLabel(label);
    const res = await api.search(params);
    setResults(res.results);
  };

  const onSubmitSearch = () => {
    if (!query.trim()) {
      setResults(null);
      return;
    }
    runSearch({ q: query.trim() }, `Results for "${query.trim()}"`);
  };

  const clearResults = () => {
    setQuery('');
    setResults(null);
  };

  return (
    <Screen>
      <TopBar title="Explore" />

      <View style={styles.search}>
        <Feather name="search" size={16} color={colors.muted} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search prayers, deities, occasions…"
          placeholderTextColor={colors.muted}
          value={query}
          onChangeText={setQuery}
          onSubmitEditing={onSubmitSearch}
          returnKeyType="search"
        />
      </View>

      <Eyebrow style={styles.sectionEyebrow}>For an occasion</Eyebrow>
      <View style={styles.chips}>
        {OCCASION_CHIPS.map((c) => (
          <Pressable
            key={c.occasion}
            style={styles.chip}
            onPress={() => {
              setQuery('');
              runSearch({ occasion: c.occasion }, c.label.replace(/^\S+\s/, ''));
            }}
          >
            <Text style={styles.chipText}>{c.label}</Text>
          </Pressable>
        ))}
      </View>

      {results !== null ? (
        <>
          <SectionHeader title={resultsLabel} action="Clear" onPressAction={clearResults} />
          <View style={styles.stack}>
            {results.length === 0 && <Text style={styles.empty}>No matches yet — try another search.</Text>}
            {results.map((p) => (
              <PracticeRow key={p.id} practice={p} onPress={() => navigation.navigate('PracticeGuide', { practiceId: p.id })} />
            ))}
          </View>
        </>
      ) : (
        <>
          <SectionHeader title="By occasion" action="All" />
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.rail}>
            {OCCASION_RAIL.map((m) => (
              <Pressable key={m.id} style={styles.mini} onPress={() => navigation.navigate('PracticeGuide', { practiceId: m.id })}>
                <Glyph glyph={m.glyph} size={38} />
                <Text style={styles.miniTitle}>{m.title}</Text>
                <Text style={styles.miniSub}>{m.subtitle}</Text>
              </Pressable>
            ))}
          </ScrollView>

          <SectionHeader title="By type" />
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.rail}>
            {TYPE_RAIL.map((m) => (
              <Pressable
                key={m.type}
                style={styles.mini}
                onPress={() => runSearch({ type: m.type }, m.title)}
              >
                <Glyph glyph={m.glyph} size={38} />
                <Text style={styles.miniTitle}>{m.title}</Text>
                <Text style={styles.miniSub}>{m.subtitle}</Text>
              </Pressable>
            ))}
          </ScrollView>

          <SectionHeader title="By deity" />
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.rail}>
            {DEITY_RAIL.map((m) => (
              <Pressable
                key={m.deity}
                style={styles.mini}
                onPress={() => runSearch({ deity: m.deity }, m.title)}
              >
                <Glyph glyph={m.glyph} size={38} />
                <Text style={styles.miniTitle}>{m.title}</Text>
                <Text style={styles.miniSub}>{m.subtitle}</Text>
              </Pressable>
            ))}
          </ScrollView>
        </>
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  search: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: 15,
    paddingVertical: 13,
    paddingHorizontal: 15,
    marginBottom: 14,
  },
  searchInput: {
    flex: 1,
    fontFamily: fonts.sans,
    fontSize: 13.5,
    color: colors.ink,
  },
  sectionEyebrow: {
    marginBottom: 10,
  },
  chips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 6,
  },
  chip: {
    backgroundColor: colors.paper2,
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: radii.pill,
    paddingVertical: 8,
    paddingHorizontal: 14,
  },
  chipText: {
    fontFamily: fonts.sansSemiBold,
    fontSize: 12.5,
    color: colors.ink,
  },
  rail: {
    marginBottom: 4,
  },
  mini: {
    width: 120,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: 16,
    padding: 13,
    marginRight: 11,
  },
  miniTitle: {
    fontFamily: fonts.sansSemiBold,
    fontSize: 13,
    color: colors.ink,
    marginTop: 10,
  },
  miniSub: {
    fontFamily: fonts.sans,
    fontSize: 11,
    color: colors.muted,
    marginTop: 3,
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
});

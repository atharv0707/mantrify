import React, { useCallback, useEffect, useState } from 'react';
import { useNavigation, useRoute } from '@react-navigation/native';
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { Screen } from '../components/Screen';
import { Panel } from '../components/Panel';
import { Toggle } from '../components/Toggle';
import { LanguageToggle } from '../components/LanguageToggle';
import { JapaRing } from '../components/JapaRing';
import { colors } from '../theme/colors';
import { fonts } from '../theme/typography';
import { api } from '../api/client';
import { useApp } from '../context/AppContext';
import type { Practice } from '../api/types';
import { todayStr } from '../utils/date';

const TYPE_LABELS: Record<string, string> = {
  puja: 'Puja',
  mantra: 'Mantra · Japa',
  aarti: 'Aarti',
  chalisa: 'Chalisa',
  stotra: 'Stotra',
  vrat: 'Vrat',
  sankalpa: 'Sankalpa',
};

export default function PracticeGuideScreen() {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const { practiceId } = route.params as { practiceId: string };
  const { language, isFavourite, toggleFavourite } = useApp();

  const [practice, setPractice] = useState<Practice | null>(null);
  const [count, setCount] = useState(0);
  const [done, setDone] = useState(false);
  const [showAllMeanings, setShowAllMeanings] = useState(false);
  const [revealed, setRevealed] = useState<Set<string>>(new Set());

  const load = useCallback(async () => {
    const res = await api.getPractice(practiceId);
    setPractice(res);
  }, [practiceId]);

  useEffect(() => {
    load();
  }, [load]);

  if (!practice) {
    return (
      <Screen>
        <BackButton onPress={() => navigation.goBack()} />
        <View style={styles.loading}>
          <ActivityIndicator color={colors.saffron} />
        </View>
      </Screen>
    );
  }

  const toggleLine = (key: string) => {
    setRevealed((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  };

  const markDone = async () => {
    setDone(true);
    await api.setCompletion({ practiceId: practice.id, date: todayStr(), done: true });
    navigation.goBack();
  };

  // The japa counter follows the first section that defines a repetition target.
  const japaSection = practice.mantras.find((s) => s.repetitionTarget != null);
  const target = japaSection?.repetitionTarget ?? null;

  return (
    <Screen>
      <BackButton onPress={() => navigation.goBack()} />

      <View style={styles.deity}>
        <View style={styles.orb}>
          <Text style={styles.orbText}>{practice.glyph}</Text>
        </View>
        <Text style={styles.h1}>{practice.title}</Text>
        <View style={styles.tags}>
          <View style={styles.tag}>
            <Text style={styles.tagText}>{TYPE_LABELS[practice.type] ?? practice.type}</Text>
          </View>
          <View style={styles.tag}>
            <Text style={styles.tagText}>~{practice.estDurationMin} min</Text>
          </View>
          <View style={styles.tag}>
            <Text style={styles.tagText}>{capitalize(practice.difficulty)}</Text>
          </View>
        </View>
        <Text style={styles.tradition}>{practice.traditionTags.map(capitalize).join(' · ')}</Text>

        <Pressable style={styles.favourite} onPress={() => toggleFavourite(practice.id)} hitSlop={10}>
          <Feather name="star" size={16} color={isFavourite(practice.id) ? colors.brass : colors.faint} />
          <Text style={[styles.favouriteText, isFavourite(practice.id) && { color: colors.brass }]}>
            {isFavourite(practice.id) ? 'Saved' : 'Save'}
          </Text>
        </Pressable>
      </View>

      <Panel label="Why this matters">
        <Text style={styles.why}>{practice.why}</Text>
      </Panel>

      <Panel label="You'll need">
        <View style={styles.samagri}>
          {practice.materials.map((m) => (
            <View key={m} style={styles.sam}>
              <Text style={styles.samText}>{m}</Text>
            </View>
          ))}
        </View>
      </Panel>

      {/* The prayer, in full — every verse, with a per-line meaning you can toggle on or off. */}
      <View style={styles.versesCard}>
        <View style={styles.versesHead}>
          <Text style={styles.versesLabel}>The prayer</Text>
          <Pressable style={styles.meaningToggle} onPress={() => setShowAllMeanings((v) => !v)} hitSlop={8}>
            <Text style={styles.meaningToggleText}>Meanings</Text>
            <Toggle value={showAllMeanings} onChange={() => setShowAllMeanings((v) => !v)} />
          </Pressable>
        </View>

        <View style={styles.languageToggleWrap}>
          <LanguageToggle />
        </View>

        {practice.mantras.map((section, si) => (
          <View key={si} style={si > 0 ? styles.sectionGap : undefined}>
            {section.label && <Text style={styles.sectionLabel}>{section.label}</Text>}
            {section.lines.map((line, li) => {
              const key = `${si}-${li}`;
              const open = showAllMeanings || revealed.has(key);
              return (
                <Pressable key={key} style={styles.line} onPress={() => toggleLine(key)}>
                  {(language === 'hi' || language === 'both') && (
                    <Text style={styles.dev}>{line.devanagari}</Text>
                  )}
                  {(language === 'en' || language === 'both') && (
                    <Text style={[styles.iast, language === 'both' && styles.iastWithDev]}>
                      {line.transliteration}
                    </Text>
                  )}
                  {open ? (
                    <Text style={styles.mean}>{line.meaning}</Text>
                  ) : (
                    <View style={styles.meanHintRow}>
                      <Feather name="chevron-down" size={12} color={colors.faint} />
                      <Text style={styles.meanHint}>Tap for meaning</Text>
                    </View>
                  )}
                </Pressable>
              );
            })}
          </View>
        ))}
      </View>

      {target && (
        <Panel label="Japa counter" centerLabel>
          <JapaRing target={target} count={count} onTap={() => setCount((c) => (c + 1) % (target + 1))} />
        </Panel>
      )}

      {practice.steps.length > 0 && (
        <Panel label="Steps">
          {practice.steps.map((step) => (
            <View key={step.order} style={styles.step}>
              <Text style={styles.stepNumber}>{step.order}</Text>
              <Text style={styles.stepText}>{step.instruction}</Text>
            </View>
          ))}
        </Panel>
      )}

      <Pressable style={styles.markDone} onPress={markDone} disabled={done}>
        <Text style={styles.markDoneText}>{done ? 'Marked as done' : 'Mark as done'}</Text>
      </Pressable>
    </Screen>
  );
}

function BackButton({ onPress }: { onPress: () => void }) {
  return (
    <Pressable style={styles.back} onPress={onPress} hitSlop={8}>
      <Feather name="chevron-left" size={16} color={colors.muted} />
      <Text style={styles.backText}>Back</Text>
    </Pressable>
  );
}

function capitalize(s: string) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

const styles = StyleSheet.create({
  loading: {
    paddingTop: 120,
    alignItems: 'center',
  },
  back: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingVertical: 8,
    marginBottom: 4,
  },
  backText: {
    fontFamily: fonts.sansSemiBold,
    fontSize: 13,
    color: colors.muted,
  },
  deity: {
    alignItems: 'center',
    marginVertical: 8,
    marginBottom: 16,
  },
  orb: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#13233f',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  orbText: {
    fontSize: 36,
    color: '#f6c879',
  },
  h1: {
    fontFamily: fonts.serif,
    fontSize: 22,
    color: colors.ink,
    textAlign: 'center',
  },
  tags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 7,
    marginTop: 9,
  },
  tag: {
    backgroundColor: colors.paper2,
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: 20,
    paddingVertical: 5,
    paddingHorizontal: 10,
  },
  tagText: {
    fontFamily: fonts.sansSemiBold,
    fontSize: 11,
    color: colors.muted,
  },
  tradition: {
    fontFamily: fonts.sansSemiBold,
    fontSize: 11.5,
    color: colors.brass,
    marginTop: 9,
    letterSpacing: 0.4,
  },
  favourite: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 12,
  },
  favouriteText: {
    fontFamily: fonts.sansSemiBold,
    fontSize: 12.5,
    color: colors.faint,
  },
  why: {
    fontFamily: fonts.sans,
    fontSize: 13,
    lineHeight: 20,
    color: '#4a3f31',
  },
  samagri: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 7,
  },
  sam: {
    backgroundColor: colors.paper2,
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: 9,
    paddingVertical: 6,
    paddingHorizontal: 10,
  },
  samText: {
    fontFamily: fonts.sansMedium,
    fontSize: 12,
    color: colors.ink,
  },
  versesCard: {
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: 16,
    padding: 14,
    marginBottom: 12,
  },
  versesHead: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  versesLabel: {
    fontFamily: fonts.sansBold,
    fontSize: 10.5,
    letterSpacing: 1.4,
    textTransform: 'uppercase',
    color: colors.faint,
  },
  meaningToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  meaningToggleText: {
    fontFamily: fonts.sansSemiBold,
    fontSize: 12,
    color: colors.muted,
  },
  languageToggleWrap: {
    marginBottom: 10,
  },
  sectionGap: {
    marginTop: 6,
  },
  sectionLabel: {
    fontFamily: fonts.sansBold,
    fontSize: 11,
    letterSpacing: 0.6,
    color: colors.saffronDeep,
    textTransform: 'uppercase',
    marginTop: 6,
    marginBottom: 8,
  },
  line: {
    borderTopWidth: 1,
    borderTopColor: colors.line,
    paddingVertical: 12,
  },
  dev: {
    fontFamily: fonts.devanagari,
    fontSize: 19,
    color: colors.ink,
    lineHeight: 32,
  },
  iast: {
    fontFamily: fonts.sansMedium,
    fontStyle: 'italic',
    color: colors.saffronDeep,
    fontSize: 13.5,
    lineHeight: 20,
  },
  iastWithDev: {
    marginTop: 7,
  },
  mean: {
    fontFamily: fonts.sans,
    fontSize: 12.5,
    color: colors.muted,
    marginTop: 8,
    lineHeight: 19,
  },
  meanHintRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    marginTop: 8,
  },
  meanHint: {
    fontFamily: fonts.sansSemiBold,
    fontSize: 11,
    color: colors.faint,
  },
  step: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12,
  },
  stepNumber: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: colors.paper2,
    textAlign: 'center',
    textAlignVertical: 'center',
    lineHeight: 22,
    fontFamily: fonts.sansBold,
    fontSize: 11,
    color: colors.saffronDeep,
    overflow: 'hidden',
  },
  stepText: {
    flex: 1,
    fontFamily: fonts.sans,
    fontSize: 13,
    lineHeight: 19,
    color: colors.ink,
  },
  markDone: {
    backgroundColor: colors.saffron,
    borderRadius: 15,
    paddingVertical: 15,
    alignItems: 'center',
    marginTop: 6,
  },
  markDoneText: {
    color: '#2a1605',
    fontFamily: fonts.sansBold,
    fontSize: 14.5,
  },
});

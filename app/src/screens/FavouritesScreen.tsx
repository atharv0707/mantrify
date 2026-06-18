import React, { useCallback, useState } from 'react';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { Screen } from '../components/Screen';
import { TopBar } from '../components/TopBar';
import { SectionHeader } from '../components/SectionHeader';
import { PracticeRow } from '../components/PracticeRow';
import { colors } from '../theme/colors';
import { fonts } from '../theme/typography';
import { api } from '../api/client';
import { useApp } from '../context/AppContext';
import type { PracticeSummary } from '../api/types';

const TYPE_ORDER: { type: PracticeSummary['type']; label: string }[] = [
  { type: 'mantra', label: 'Mantras' },
  { type: 'aarti', label: 'Aartis' },
  { type: 'chalisa', label: 'Chalisas' },
  { type: 'stotra', label: 'Stotras' },
  { type: 'puja', label: 'Pujas' },
  { type: 'vrat', label: 'Vrats' },
  { type: 'sankalpa', label: 'Sankalpas' },
];

export default function FavouritesScreen() {
  const navigation = useNavigation<any>();
  const { toggleFavourite } = useApp();
  const [items, setItems] = useState<PracticeSummary[] | null>(null);

  const load = useCallback(async () => {
    const res = await api.getFavourites();
    setItems(res.items);
  }, []);

  useFocusEffect(
    useCallback(() => {
      load();
    }, [load])
  );

  const remove = async (id: string) => {
    setItems((prev) => (prev ? prev.filter((p) => p.id !== id) : prev));
    await toggleFavourite(id);
  };

  if (!items) {
    return (
      <Screen>
        <TopBar title="Favourites" />
        <View style={styles.loading}>
          <ActivityIndicator color={colors.saffron} />
        </View>
      </Screen>
    );
  }

  const groups = TYPE_ORDER.map((g) => ({
    ...g,
    rows: items.filter((p) => p.type === g.type),
  })).filter((g) => g.rows.length > 0);

  return (
    <Screen onRefresh={load} refreshing={false}>
      <TopBar title="Favourites" />

      {items.length === 0 ? (
        <View style={styles.empty}>
          <View style={styles.emptyOrb}>
            <Feather name="star" size={26} color={colors.rose} />
          </View>
          <Text style={styles.emptyTitle}>No favourites yet</Text>
          <Text style={styles.emptyBody}>
            Tap the star on any prayer to save it here for quick access — your mantras, aartis,
            chalisas and more, all in one place.
          </Text>
          <Pressable style={styles.exploreBtn} onPress={() => navigation.navigate('Explore')}>
            <Text style={styles.exploreBtnText}>Explore prayers</Text>
          </Pressable>
        </View>
      ) : (
        groups.map((g) => (
          <View key={g.type}>
            <SectionHeader title={g.label} />
            <View style={styles.stack}>
              {g.rows.map((p) => (
                <PracticeRow
                  key={p.id}
                  practice={p}
                  onPress={() => navigation.navigate('PracticeGuide', { practiceId: p.id })}
                  isFavourite
                  onToggleFavourite={() => remove(p.id)}
                />
              ))}
            </View>
          </View>
        ))
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  loading: {
    paddingTop: 120,
    alignItems: 'center',
  },
  stack: {
    gap: 11,
  },
  empty: {
    alignItems: 'center',
    paddingTop: 80,
    paddingHorizontal: 16,
  },
  emptyOrb: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: colors.paper2,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  emptyTitle: {
    fontFamily: fonts.serif,
    fontSize: 19,
    color: colors.ink,
  },
  emptyBody: {
    fontFamily: fonts.sans,
    fontSize: 13,
    color: colors.muted,
    textAlign: 'center',
    lineHeight: 20,
    marginTop: 10,
    marginBottom: 22,
  },
  exploreBtn: {
    backgroundColor: colors.saffron,
    borderRadius: 30,
    paddingVertical: 13,
    paddingHorizontal: 24,
  },
  exploreBtnText: {
    color: '#2a1605',
    fontFamily: fonts.sansBold,
    fontSize: 13.5,
  },
});

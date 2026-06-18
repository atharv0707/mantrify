import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { Card } from './Card';
import { Glyph } from './Glyph';
import { colors } from '../theme/colors';
import { fonts } from '../theme/typography';
import type { PracticeSummary } from '../api/types';

export function PracticeRow({
  practice,
  onPress,
  trailing,
  isFavourite,
  onToggleFavourite,
}: {
  practice: PracticeSummary;
  onPress: () => void;
  trailing?: React.ReactNode;
  isFavourite?: boolean;
  onToggleFavourite?: () => void;
}) {
  return (
    <Card onPress={onPress} style={styles.row}>
      <Glyph glyph={practice.glyph} style={practice.glyphStyle} />
      <View style={styles.text}>
        <Text style={styles.title} numberOfLines={1}>{practice.title}</Text>
        <Text style={styles.subtitle} numberOfLines={1}>{practice.summary}</Text>
      </View>
      {onToggleFavourite && (
        <Pressable style={styles.favouriteBtn} onPress={onToggleFavourite} hitSlop={10}>
          <Feather name="star" size={17} color={isFavourite ? colors.brass : colors.faint} />
        </Pressable>
      )}
      {trailing && <View style={styles.trailing}>{trailing}</View>}
    </Card>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 13,
  },
  text: {
    flex: 1,
    marginLeft: 13,
  },
  title: {
    fontFamily: fonts.sansSemiBold,
    fontSize: 14.5,
    color: colors.ink,
    lineHeight: 19,
  },
  subtitle: {
    fontFamily: fonts.sans,
    fontSize: 12,
    color: colors.muted,
    marginTop: 3,
  },
  favouriteBtn: {
    marginLeft: 'auto',
    paddingLeft: 8,
  },
  trailing: {
    marginLeft: 'auto',
    paddingLeft: 8,
  },
});

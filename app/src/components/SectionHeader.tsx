import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { colors } from '../theme/colors';
import { fonts } from '../theme/typography';

export function SectionHeader({ title, action, onPressAction }: { title: string; action?: string; onPressAction?: () => void }) {
  return (
    <View style={styles.row}>
      <Text style={styles.title}>{title}</Text>
      {action && (
        <Pressable onPress={onPressAction} hitSlop={8}>
          <Text style={styles.action}>{action}</Text>
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'space-between',
    marginTop: 22,
    marginBottom: 12,
  },
  title: {
    fontFamily: fonts.serif,
    fontSize: 16.5,
    color: colors.ink,
  },
  action: {
    fontFamily: fonts.sansSemiBold,
    fontSize: 12,
    color: colors.saffronDeep,
  },
});

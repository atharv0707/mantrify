import React, { PropsWithChildren } from 'react';
import { StyleSheet, Text, View, ViewStyle } from 'react-native';
import { colors } from '../theme/colors';
import { fonts } from '../theme/typography';

export function Panel({ label, children, style, centerLabel }: PropsWithChildren<{ label: string; style?: ViewStyle; centerLabel?: boolean }>) {
  return (
    <View style={[styles.panel, style]}>
      <Text style={[styles.label, centerLabel && styles.labelCenter]}>{label}</Text>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  panel: {
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: 16,
    padding: 14,
    marginBottom: 12,
  },
  label: {
    fontFamily: fonts.sansBold,
    fontSize: 10.5,
    letterSpacing: 1.4,
    textTransform: 'uppercase',
    color: colors.faint,
    marginBottom: 9,
  },
  labelCenter: {
    textAlign: 'center',
  },
});

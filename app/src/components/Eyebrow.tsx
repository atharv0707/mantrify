import React from 'react';
import { StyleSheet, Text, TextStyle } from 'react-native';
import { colors } from '../theme/colors';
import { fonts } from '../theme/typography';

export function Eyebrow({ children, style }: { children: React.ReactNode; style?: TextStyle }) {
  return <Text style={[styles.text, style]}>{children}</Text>;
}

const styles = StyleSheet.create({
  text: {
    fontFamily: fonts.sansBold,
    fontSize: 10.5,
    letterSpacing: 1.6,
    textTransform: 'uppercase',
    color: colors.saffronDeep,
  },
});

import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { colors } from '../theme/colors';

const STYLES: Record<string, { colors: [string, string]; text: string }> = {
  default: { colors: [colors.amber1, colors.amber2], text: colors.saffronDeep },
  indigo: { colors: [colors.indigoLight, colors.indigo], text: '#f4dba7' },
  peacock: { colors: [colors.peacockLight, colors.peacock], text: '#cdeef0' },
  rose: { colors: [colors.rose, '#f3c9c0'], text: colors.roseDeep },
};

export function Glyph({ glyph, style = 'default', size = 46 }: { glyph: string; style?: string; size?: number }) {
  const s = STYLES[style] ?? STYLES.default;
  return (
    <View
      style={[
        styles.base,
        { width: size, height: size, borderRadius: size * 0.3, backgroundColor: s.colors[1] },
      ]}
    >
      <Text style={{ fontSize: size * 0.46, color: s.text }}>{glyph}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  base: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});

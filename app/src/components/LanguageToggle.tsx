import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { colors } from '../theme/colors';
import { fonts } from '../theme/typography';
import { useApp, type Language } from '../context/AppContext';

const OPTIONS: { value: Language; label: string }[] = [
  { value: 'en', label: 'English' },
  { value: 'hi', label: 'Hindi' },
  { value: 'both', label: 'Both' },
];

export function LanguageToggle() {
  const { language, setLanguage } = useApp();
  return (
    <View style={styles.track}>
      {OPTIONS.map((o) => (
        <Pressable
          key={o.value}
          style={[styles.option, language === o.value && styles.optionActive]}
          onPress={() => setLanguage(o.value)}
          hitSlop={4}
        >
          <Text style={[styles.optionText, language === o.value && styles.optionTextActive]}>
            {o.label}
          </Text>
        </Pressable>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  track: {
    flexDirection: 'row',
    alignSelf: 'flex-start',
    backgroundColor: colors.paper2,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.line,
    padding: 3,
    gap: 2,
  },
  option: {
    paddingVertical: 6,
    paddingHorizontal: 11,
    borderRadius: 9,
  },
  optionActive: {
    backgroundColor: colors.saffron,
  },
  optionText: {
    fontFamily: fonts.sansSemiBold,
    fontSize: 11.5,
    color: colors.muted,
  },
  optionTextActive: {
    color: '#2a1605',
  },
});

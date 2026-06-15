import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { colors } from '../theme/colors';

export function Toggle({ value, onChange }: { value: boolean; onChange: () => void }) {
  return (
    <Pressable style={[styles.track, value && styles.trackOn]} onPress={onChange} hitSlop={8}>
      <View style={[styles.thumb, value && styles.thumbOn]} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  track: {
    width: 42,
    height: 24,
    borderRadius: 20,
    backgroundColor: colors.faint,
    justifyContent: 'center',
  },
  trackOn: {
    backgroundColor: colors.saffron,
  },
  thumb: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#fff',
    marginLeft: 2,
  },
  thumbOn: {
    marginLeft: 20,
  },
});

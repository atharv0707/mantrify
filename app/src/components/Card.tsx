import React, { PropsWithChildren } from 'react';
import { Pressable, StyleSheet, View, ViewStyle } from 'react-native';
import { colors, radii } from '../theme/colors';

export function Card({
  children,
  onPress,
  style,
}: PropsWithChildren<{ onPress?: () => void; style?: ViewStyle }>) {
  if (onPress) {
    return (
      <Pressable
        onPress={onPress}
        style={({ pressed }) => [styles.card, style, pressed && styles.pressed]}
      >
        {children}
      </Pressable>
    );
  }
  return <View style={[styles.card, style]}>{children}</View>;
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: radii.card,
    padding: 14,
  },
  pressed: {
    opacity: 0.85,
  },
});

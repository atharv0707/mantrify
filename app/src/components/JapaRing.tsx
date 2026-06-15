import React, { useRef } from 'react';
import { Animated, Pressable, StyleSheet, Text, View } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import * as Haptics from 'expo-haptics';
import { colors } from '../theme/colors';
import { fonts } from '../theme/typography';

const SIZE = 172;
const STROKE = 10;
const RADIUS = (SIZE - STROKE) / 2;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

export function JapaRing({ target, count, onTap }: { target: number; count: number; onTap: () => void }) {
  const scale = useRef(new Animated.Value(1)).current;
  const offset = CIRCUMFERENCE - CIRCUMFERENCE * (count / target);

  const handlePress = () => {
    Animated.sequence([
      Animated.timing(scale, { toValue: 1.035, duration: 90, useNativeDriver: true }),
      Animated.timing(scale, { toValue: 1, duration: 90, useNativeDriver: true }),
    ]).start();
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
    onTap();
  };

  return (
    <View style={styles.wrap}>
      <Pressable onPress={handlePress} accessibilityRole="button" accessibilityLabel="Tap to count one repetition">
        <Animated.View style={{ transform: [{ scale }] }}>
          <Svg width={SIZE} height={SIZE} viewBox={`0 0 ${SIZE} ${SIZE}`}>
            <Circle
              cx={SIZE / 2}
              cy={SIZE / 2}
              r={RADIUS}
              stroke="rgba(36,28,19,0.08)"
              strokeWidth={STROKE}
              fill="none"
            />
            <AnimatedCircle
              cx={SIZE / 2}
              cy={SIZE / 2}
              r={RADIUS}
              stroke={colors.saffron}
              strokeWidth={STROKE}
              fill="none"
              strokeLinecap="round"
              strokeDasharray={CIRCUMFERENCE}
              strokeDashoffset={offset}
              rotation="-90"
              origin={`${SIZE / 2}, ${SIZE / 2}`}
            />
          </Svg>
          <View style={styles.center}>
            <Text style={styles.count}>{count}</Text>
            <Text style={styles.of}>of {target}</Text>
          </View>
        </Animated.View>
      </Pressable>
      <Text style={styles.hint}>Tap the ring with each repetition</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    alignItems: 'center',
    paddingVertical: 8,
  },
  center: {
    position: 'absolute',
    inset: 0,
    width: SIZE,
    height: SIZE,
    alignItems: 'center',
    justifyContent: 'center',
  },
  count: {
    fontFamily: fonts.serif,
    fontSize: 40,
    color: colors.ink,
    lineHeight: 44,
  },
  of: {
    fontFamily: fonts.sansSemiBold,
    fontSize: 12,
    color: colors.muted,
    marginTop: 4,
  },
  hint: {
    fontFamily: fonts.sansSemiBold,
    fontSize: 11.5,
    color: colors.faint,
    marginTop: 12,
  },
});

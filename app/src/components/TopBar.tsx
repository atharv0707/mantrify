import React from 'react';
import { useNavigation } from '@react-navigation/native';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { colors } from '../theme/colors';
import { fonts } from '../theme/typography';

export function TopBar({ title, showFlame = false, avatarLetter = 'A' }: { title: string; showFlame?: boolean; avatarLetter?: string }) {
  const navigation = useNavigation<any>();
  return (
    <View style={styles.row}>
      <View style={styles.nameRow}>
        {showFlame && <Text style={styles.flame}>🔥</Text>}
        <Text style={styles.name}>{title}</Text>
      </View>
      <Pressable
        style={styles.avatar}
        onPress={() => navigation.navigate('Main', { screen: 'Profile' })}
      >
        <Text style={styles.avatarText}>{avatarLetter}</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 6,
    marginBottom: 6,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  flame: {
    fontSize: 18,
  },
  name: {
    fontFamily: fonts.serif,
    fontSize: 18,
    color: colors.ink,
  },
  avatar: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: colors.indigo,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    color: '#f3d9a6',
    fontFamily: fonts.sansBold,
    fontSize: 13,
  },
});

import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';

interface AvatarProps {
  name: string;
  size?: number;
  color?: string;
  imageUrl?: string;
  style?: ViewStyle;
}

export function Avatar({ name, size = 40, color = '#3b82f6', style }: AvatarProps) {
  const initials = (name || 'U')
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .substring(0, 2);

  return (
    <View
      style={[
        styles.container,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: color,
        },
        style,
      ]}
    >
      <Text style={[styles.text, { fontSize: size * 0.38 }]}>{initials}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    color: '#ffffff',
    fontWeight: '700',
  },
});

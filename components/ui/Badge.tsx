import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';

interface BadgeProps {
  text: string;
  variant?: 'default' | 'success' | 'warning' | 'destructive' | 'info' | 'outline' | 'accent';
  size?: 'sm' | 'md';
  style?: ViewStyle;
}

const variantColors: Record<string, { bg: string; text: string; border?: string }> = {
  default: { bg: '#f1f5f9', text: '#475569' },
  success: { bg: '#dcfce7', text: '#166534' },
  warning: { bg: '#fef3c7', text: '#92400e' },
  destructive: { bg: '#fef2f3', text: '#b91c1c' },
  info: { bg: '#dbeafe', text: '#1e40af' },
  outline: { bg: 'transparent', text: '#475569', border: '#e2e8f0' },
  accent: { bg: '#d4183d', text: '#ffffff' },
};

export function Badge({ text, variant = 'default', size = 'sm', style }: BadgeProps) {
  const colors = variantColors[variant];

  return (
    <View
      style={[
        styles.base,
        {
          backgroundColor: colors.bg,
          borderWidth: variant === 'outline' ? 1 : 0,
          borderColor: colors.border || 'transparent',
        },
        size === 'md' && styles.sizeMd,
        style,
      ]}
    >
      <Text
        style={[
          styles.text,
          { color: colors.text },
          size === 'md' && styles.textMd,
        ]}
        numberOfLines={1}
      >
        {text}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  base: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 9999,
    alignSelf: 'flex-start',
  },
  sizeMd: {
    paddingHorizontal: 12,
    paddingVertical: 4,
  },
  text: {
    fontSize: 11,
    fontWeight: '600',
  },
  textMd: {
    fontSize: 13,
  },
});

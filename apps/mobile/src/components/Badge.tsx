import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { borderRadius, spacing, tokens } from '../theme';

type BadgeVariant = 'primary' | 'orange' | 'red' | 'green' | 'purple' | 'pink' | 'gray';

interface BadgeProps {
  label: string;
  variant?: BadgeVariant;
  size?: 'small' | 'medium';
  style?: ViewStyle;
}

const variantColors: Record<BadgeVariant, { bg: string; text: string }> = {
  primary: { bg: '#E8EAFF', text: tokens.colors.brand.primary },
  orange: { bg: '#FFF3E0', text: tokens.colors.state.warning },
  red: { bg: '#FFEBEE', text: tokens.colors.state.error },
  green: { bg: '#E8F5E9', text: tokens.colors.state.success },
  purple: { bg: '#F3E5F5', text: '#7B1FA2' },
  pink: { bg: '#FCE4EC', text: '#C2185B' },
  gray: { bg: '#F5F5F5', text: tokens.colors.text.secondary },
};

export function Badge({ label, variant = 'primary', size = 'small', style }: BadgeProps) {
  const colorScheme = variantColors[variant];

  return (
    <View
      style={[
        styles.badge,
        styles[size],
        { backgroundColor: colorScheme.bg },
        style,
      ]}
    >
      <Text style={[styles.text, styles[`${size}Text`], { color: colorScheme.text }]}>
        {label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    borderRadius: borderRadius.sm,
    alignSelf: 'flex-start',
  },
  small: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
  },
  medium: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
  },
  text: {
    fontWeight: '600',
  },
  smallText: {
    fontSize: 10,
  },
  mediumText: {
    fontSize: tokens.typography.small.size,
  },
});

import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { colors, borderRadius, spacing } from '../theme';

interface CardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  padding?: 'none' | 'small' | 'medium' | 'large';
}

export function Card({ children, style, padding = 'medium' }: CardProps) {
  return (
    <View style={[styles.card, styles[padding], style]}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.white,
    borderRadius: borderRadius.lg,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  none: {
    padding: 0,
  },
  small: {
    padding: spacing.sm,
  },
  medium: {
    padding: spacing.md,
  },
  large: {
    padding: spacing.lg,
  },
});

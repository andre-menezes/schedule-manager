import { StyleSheet } from 'react-native';
import { colors } from './colors';

export const typography = StyleSheet.create({
  // Headings
  h1: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.textPrimary,
    lineHeight: 36,
  },
  h2: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.textPrimary,
    lineHeight: 32,
  },
  h3: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.textPrimary,
    lineHeight: 28,
  },
  h4: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.textPrimary,
    lineHeight: 24,
  },

  // Body text
  bodyLarge: {
    fontSize: 16,
    fontWeight: '400',
    color: colors.textPrimary,
    lineHeight: 24,
  },
  body: {
    fontSize: 14,
    fontWeight: '400',
    color: colors.textPrimary,
    lineHeight: 20,
  },
  bodySmall: {
    fontSize: 12,
    fontWeight: '400',
    color: colors.textSecondary,
    lineHeight: 18,
  },

  // Labels
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.textPrimary,
  },
  labelSmall: {
    fontSize: 12,
    fontWeight: '500',
    color: colors.textSecondary,
  },

  // Buttons
  button: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.white,
  },
  buttonSmall: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.white,
  },

  // Links
  link: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.primary,
  },
});

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const borderRadius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  full: 9999,
};

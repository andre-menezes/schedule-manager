import { Platform, StyleSheet, type ViewStyle } from 'react-native';
import { tokens } from './tokens';
import { colors } from './colors';

const t = tokens.typography;
const e = tokens.elevation;

// ─── Typography styles ────────────────────────────────────────────────────────
export const typography = StyleSheet.create({
  display: {
    fontSize: t.display.size,
    fontWeight: t.display.weight,
    color: colors.textPrimary,
    lineHeight: t.display.lineHeight,
  },
  h1: {
    fontSize: t.h1.size,
    fontWeight: t.h1.weight,
    color: colors.textPrimary,
    lineHeight: t.h1.lineHeight,
  },
  h2: {
    fontSize: t.h2.size,
    fontWeight: t.h2.weight,
    color: colors.textPrimary,
    lineHeight: t.h2.lineHeight,
  },
  body: {
    fontSize: t.body.size,
    fontWeight: t.body.weight,
    color: colors.textPrimary,
    lineHeight: t.body.lineHeight,
  },
  caption: {
    fontSize: t.caption.size,
    fontWeight: t.caption.weight,
    color: colors.textSecondary,
    lineHeight: t.caption.lineHeight,
  },
  small: {
    fontSize: t.small.size,
    fontWeight: t.small.weight,
    color: colors.textSecondary,
    lineHeight: t.small.lineHeight,
  },
  button: {
    fontSize: t.button.size,
    fontWeight: t.button.weight,
    color: colors.textWhite,
    lineHeight: t.button.lineHeight,
  },

  // ─── Legacy aliases (backward compat) ──────────────────────────────────────
  h3: {
    fontSize: t.h2.size,
    fontWeight: t.h2.weight,
    color: colors.textPrimary,
    lineHeight: t.h2.lineHeight,
  },
  h4: {
    fontSize: t.caption.size,
    fontWeight: '500' as const,
    color: colors.textPrimary,
    lineHeight: t.caption.lineHeight,
  },
  bodyLarge: {
    fontSize: t.body.size,
    fontWeight: t.body.weight,
    color: colors.textPrimary,
    lineHeight: t.body.lineHeight,
  },
  bodySmall: {
    fontSize: t.small.size,
    fontWeight: t.small.weight,
    color: colors.textSecondary,
    lineHeight: t.small.lineHeight,
  },
  label: {
    fontSize: t.caption.size,
    fontWeight: '500' as const,
    color: colors.textPrimary,
  },
  labelSmall: {
    fontSize: t.small.size,
    fontWeight: '500' as const,
    color: colors.textSecondary,
  },
  buttonSmall: {
    fontSize: t.caption.size,
    fontWeight: t.button.weight,
    color: colors.textWhite,
  },
  link: {
    fontSize: t.caption.size,
    fontWeight: '500' as const,
    color: colors.primary,
  },
});

// ─── Spacing scale ────────────────────────────────────────────────────────────
export const spacing = {
  none: 0,
  xs: 4,
  sm: 8,
  md: 12,
  base: 16,
  lg: 20,
  xl: 24,
  xxl: 32,
  xxxl: 40,
  huge: 48,
  giant: 64,
} as const;

// ─── Border radius ────────────────────────────────────────────────────────────
export const borderRadius = {
  sm: tokens.radius.sm,   // 6
  md: tokens.radius.md,   // 10
  lg: tokens.radius.lg,   // 16
  xl: tokens.radius.xl,   // 24
  pill: tokens.radius.pill, // 999
  // legacy alias
  full: tokens.radius.pill,
} as const;

// ─── Elevation ────────────────────────────────────────────────────────────────
export const elevation = {
  level0: Platform.select<Partial<ViewStyle>>({
    ios: e.ios.level0,
    android: { elevation: e.android.level0 },
    default: {},
  }),
  level1: Platform.select<Partial<ViewStyle>>({
    ios: { ...e.ios.level1, shadowColor: colors.textPrimary },
    android: { elevation: e.android.level1 },
    default: {},
  }),
  level2: Platform.select<Partial<ViewStyle>>({
    ios: { ...e.ios.level2, shadowColor: colors.textPrimary },
    android: { elevation: e.android.level2 },
    default: {},
  }),
  level3: Platform.select<Partial<ViewStyle>>({
    ios: { ...e.ios.level3, shadowColor: colors.textPrimary },
    android: { elevation: e.android.level3 },
    default: {},
  }),
};

import { tokens } from './tokens';

export const colors = {
  // Brand
  primary: tokens.colors.brand.primary,
  primaryLight: tokens.colors.brand.primaryLight,
  primaryDark: tokens.colors.brand.primaryDark,

  // Backgrounds
  background: tokens.colors.background.default,
  surface: tokens.colors.background.surface,

  // Border
  border: tokens.colors.border.default,

  // Text
  textPrimary: tokens.colors.text.primary,
  textSecondary: tokens.colors.text.secondary,
  textLight: tokens.colors.text.muted,
  textWhite: tokens.colors.text.inverse,

  // State
  success: tokens.colors.state.success,
  error: tokens.colors.state.error,
  warning: tokens.colors.state.warning,

  // Label colors (for badges/tags)
  labelOrange: tokens.colors.state.warning,
  labelRed: '#F96060',
  labelBlue: tokens.colors.brand.primary,
  labelGreen: tokens.colors.state.success,
  labelPurple: '#9B59B6',
  labelPink: tokens.colors.state.error,

  // Misc
  white: tokens.colors.background.surface,
  black: '#000000',
  secondary: '#F96060',
  overlay: tokens.colors.overlay,
};

export const gradients = {
  primary: [tokens.colors.brand.primary, tokens.colors.brand.primaryLight],
  purple: [tokens.colors.brand.primary, '#8B94E8'],
};

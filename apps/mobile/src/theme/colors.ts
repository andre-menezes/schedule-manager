const baseColors = {
  white: '#FFFFFF',
  black: '#000000',
  background: '#F6F6F6',
  border: '#E8E8E8',
  primary: '#5B67CA',
  primaryLight: '#7B85D6',
  primaryDark: '#4A56B5',
  secondary: '#F96060',
  success: '#2ECC71',
  labelPurple: '#9B59B6',
  purpleLight: '#8B94E8',
  error: '#E91E63',
  warning: '#F9A826',
  textPrimary: '#10275A',
  textSecondary: '#8A8BB3',
  textLight: '#B8B8D2',
  overlay: 'rgba(91, 103, 202, 0.95)',
};

export const colors = {
  // Primary colors
  primary: baseColors.primary,
  primaryLight: baseColors.primaryLight,
  primaryDark: baseColors.primaryDark,

  // Secondary colors
  secondary: baseColors.secondary,
  accent: baseColors.warning,

  // Label colors
  labelOrange: baseColors.warning,
  labelRed: baseColors.secondary,
  labelBlue: baseColors.primary,
  labelGreen: baseColors.success,
  labelPurple: baseColors.labelPurple,
  labelPink: baseColors.error,

  // Status colors
  success: baseColors.success,
  warning: baseColors.warning,
  error: baseColors.secondary,
  info: baseColors.primary,

  // Neutral colors
  white: baseColors.white,
  black: baseColors.black,
  background: baseColors.background,
  surface: baseColors.white,
  border: baseColors.border,
  // Text colors
  textPrimary: baseColors.textPrimary,
  textSecondary: baseColors.textSecondary,
  textLight: baseColors.textLight,
  textWhite: baseColors.white,

  // Overlay
  overlay: baseColors.overlay,
};

export const gradients = {
  primary: [baseColors.primary, baseColors.primaryLight],
  purple: [baseColors.primary, baseColors.purpleLight],
};

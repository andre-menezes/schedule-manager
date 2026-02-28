export const tokens = {
  colors: {
    brand: {
      primary: '#5B67CA',
      primaryLight: '#7B85D6',
      primaryDark: '#4A56B5',
    },
    background: {
      default: '#F6F6F6',
      surface: '#FFFFFF',
    },
    border: {
      default: '#E8E8E8',
    },
    text: {
      primary: '#10275A',
      secondary: '#8A8BB3',
      muted: '#B8B8D2',
      inverse: '#FFFFFF',
    },
    state: {
      success: '#2ECC71',
      error: '#E91E63',
      warning: '#F9A826',
    },
    overlay: 'rgba(91,103,202,0.95)',
  },

  typography: {
    fontFamily: {
      base: 'System',
      heading: 'System',
    },

    display: { size: 28, weight: '700', lineHeight: 36 },
    h1: { size: 22, weight: '700', lineHeight: 30 },
    h2: { size: 18, weight: '600', lineHeight: 26 },
    body: { size: 16, weight: '400', lineHeight: 24 },
    caption: { size: 14, weight: '400', lineHeight: 20 },
    small: { size: 12, weight: '400', lineHeight: 18 },
    button: { size: 16, weight: '600', lineHeight: 20 },
  },

  spacing: {
    scale: [0, 4, 8, 12, 16, 20, 24, 32, 40, 48, 64],
  },

  radius: {
    sm: 4,
    md: 6,
    lg: 8,
    xl: 12,
    pill: 999,
  },

  elevation: {
    ios: {
      level0: {
        shadowOpacity: 0,
        shadowRadius: 0,
        shadowOffset: { width: 0, height: 0 },
      },
      level1: {
        shadowOpacity: 0.08,
        shadowRadius: 4,
        shadowOffset: { width: 0, height: 2 },
      },
      level2: {
        shadowOpacity: 0.12,
        shadowRadius: 8,
        shadowOffset: { width: 0, height: 4 },
      },
      level3: {
        shadowOpacity: 0.18,
        shadowRadius: 12,
        shadowOffset: { width: 0, height: 6 },
      },
    },

    android: {
      level0: 0,
      level1: 4,
      level2: 8,
      level3: 12,
    },
  },

  motion: {
    duration: {
      fast: 120,
      normal: 200,
      slow: 320,
    },

    easing: {
      standard: 'easeInOut',
      accelerate: 'easeIn',
      decelerate: 'easeOut',
    },
  },

  state: {
    opacity: {
      disabled: 0.4,
      pressed: 0.7,
      focus: 0.9,
    },
  },
} as const;

export type Tokens = typeof tokens;

export type ColorTokens = Tokens['colors'];
export type TypographyTokens = Tokens['typography'];
export type SpacingScale = Tokens['spacing']['scale'][number];
export type RadiusTokens = keyof Tokens['radius'];
export type ElevationLevel = keyof Tokens['elevation']['android'];

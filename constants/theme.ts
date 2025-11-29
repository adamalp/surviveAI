// SurviveAI Theme System - Military/Tactical Design

export const colors = {
  dark: {
    // Backgrounds
    background: '#0D1117',
    backgroundSecondary: '#161B22',
    backgroundTertiary: '#21262D',

    // Borders
    border: '#30363D',
    borderLight: '#21262D',

    // Text
    text: '#E6EDF3',
    textSecondary: '#8B949E',
    textMuted: '#6E7681',

    // Accent
    accent: '#3FB950',
    accentDark: '#238636',
    accentLight: '#56D364',

    // Semantic
    danger: '#F85149',
    dangerBackground: '#3D1D1D',
    warning: '#D29922',
    warningBackground: '#3D2E1D',
    success: '#3FB950',
    successBackground: '#1D3D26',
    info: '#58A6FF',
    infoBackground: '#1D2D3D',

    // Components
    inputBackground: '#0D1117',
    cardBackground: '#161B22',
    tabBar: '#161B22',
    tabBarBorder: '#30363D',
  },
  light: {
    // Backgrounds
    background: '#F6F8FA',
    backgroundSecondary: '#FFFFFF',
    backgroundTertiary: '#F0F2F4',

    // Borders
    border: '#D1D5DB',
    borderLight: '#E5E7EB',

    // Text
    text: '#1F2328',
    textSecondary: '#656D76',
    textMuted: '#8B949E',

    // Accent (same in both themes)
    accent: '#238636',
    accentDark: '#1A7F37',
    accentLight: '#3FB950',

    // Semantic
    danger: '#CF222E',
    dangerBackground: '#FFEBE9',
    warning: '#9A6700',
    warningBackground: '#FFF8C5',
    success: '#1A7F37',
    successBackground: '#DAFBE1',
    info: '#0969DA',
    infoBackground: '#DDF4FF',

    // Components
    inputBackground: '#FFFFFF',
    cardBackground: '#FFFFFF',
    tabBar: '#FFFFFF',
    tabBarBorder: '#D1D5DB',
  },
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
  xxxl: 48,
} as const;

export const borderRadius = {
  none: 0,
  sm: 2,
  md: 4,
  lg: 6,
  xl: 8,
} as const;

export const typography = {
  // Font sizes
  sizes: {
    xs: 11,
    sm: 12,
    md: 14,
    lg: 16,
    xl: 18,
    xxl: 20,
    xxxl: 24,
    display: 32,
  },
  // Font weights
  weights: {
    regular: '400' as const,
    medium: '500' as const,
    semibold: '600' as const,
    bold: '700' as const,
  },
  // Line heights
  lineHeights: {
    tight: 1.2,
    normal: 1.5,
    relaxed: 1.75,
  },
} as const;

export const shadows = {
  none: {
    shadowColor: 'transparent',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0,
    shadowRadius: 0,
    elevation: 0,
  },
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 4,
  },
  lg: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 8,
  },
} as const;

// Helper to get theme colors
export type ThemeMode = 'dark' | 'light';
export type ThemeColors = typeof colors.dark;

export const getColors = (mode: ThemeMode): ThemeColors => colors[mode];

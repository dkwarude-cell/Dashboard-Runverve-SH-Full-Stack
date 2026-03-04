export const Colors = {
  primary: {
    DEFAULT: '#030213',
    50: '#f0f0ff',
    100: '#e0e0fe',
    500: '#3b37f5',
    600: '#2721d9',
    950: '#030213',
  },
  accent: {
    DEFAULT: '#d4183d',
    50: '#fef2f3',
    500: '#e84d6a',
    600: '#d4183d',
    700: '#b31235',
  },
  success: '#10b981',
  warning: '#f59e0b',
  info: '#3b82f6',
  destructive: '#d4183d',
  background: '#ffffff',
  foreground: '#030213',
  muted: '#f1f5f9',
  mutedForeground: '#64748b',
  border: '#e2e8f0',
  card: '#ffffff',
  chart: {
    1: '#e84d6a',
    2: '#3b82f6',
    3: '#10b981',
    4: '#f59e0b',
    5: '#8b5cf6',
  },
} as const;

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  '2xl': 24,
  '3xl': 32,
  '4xl': 40,
  '5xl': 48,
} as const;

export const FontSizes = {
  xs: 12,
  sm: 14,
  base: 16,
  lg: 18,
  xl: 20,
  '2xl': 24,
  '3xl': 30,
  '4xl': 36,
} as const;

export const BorderRadius = {
  sm: 6,
  md: 8,
  lg: 12,
  xl: 16,
  full: 9999,
} as const;

// Responsive breakpoints
export const Breakpoints = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536,
} as const;

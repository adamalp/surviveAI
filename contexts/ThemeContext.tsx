import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { useColorScheme } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { colors, spacing, borderRadius, typography, shadows, ThemeColors, ThemeMode } from '@/constants/theme';

const THEME_STORAGE_KEY = 'surviveai_theme_preference';

interface ThemeContextType {
  // Current theme mode
  mode: ThemeMode;
  isDark: boolean;

  // Theme colors
  colors: ThemeColors;

  // Design tokens
  spacing: typeof spacing;
  borderRadius: typeof borderRadius;
  typography: typeof typography;
  shadows: typeof shadows;

  // Actions
  setMode: (mode: ThemeMode | 'system') => void;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

interface ThemeProviderProps {
  children: ReactNode;
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  const systemColorScheme = useColorScheme();
  const [userPreference, setUserPreference] = useState<ThemeMode | 'system'>('system');
  const [isLoaded, setIsLoaded] = useState(false);

  // Determine actual mode based on preference
  const mode: ThemeMode =
    userPreference === 'system'
      ? (systemColorScheme === 'dark' ? 'dark' : 'light')
      : userPreference;

  const isDark = mode === 'dark';

  // Load saved preference on mount
  useEffect(() => {
    loadThemePreference();
  }, []);

  const loadThemePreference = async () => {
    try {
      const saved = await AsyncStorage.getItem(THEME_STORAGE_KEY);
      if (saved && (saved === 'dark' || saved === 'light' || saved === 'system')) {
        setUserPreference(saved as ThemeMode | 'system');
      }
    } catch (error) {
      console.error('Failed to load theme preference:', error);
    } finally {
      setIsLoaded(true);
    }
  };

  const setMode = async (newMode: ThemeMode | 'system') => {
    setUserPreference(newMode);
    try {
      await AsyncStorage.setItem(THEME_STORAGE_KEY, newMode);
    } catch (error) {
      console.error('Failed to save theme preference:', error);
    }
  };

  const toggleTheme = () => {
    const newMode = isDark ? 'light' : 'dark';
    setMode(newMode);
  };

  const value: ThemeContextType = {
    mode,
    isDark,
    colors: colors[mode],
    spacing,
    borderRadius,
    typography,
    shadows,
    setMode,
    toggleTheme,
  };

  // Don't render until we've loaded the preference to avoid flash
  if (!isLoaded) {
    return null;
  }

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme(): ThemeContextType {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}

// Convenience hook for just colors
export function useColors(): ThemeColors {
  const { colors } = useTheme();
  return colors;
}

// Convenience hook for dark mode check
export function useIsDark(): boolean {
  const { isDark } = useTheme();
  return isDark;
}

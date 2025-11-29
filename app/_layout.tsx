import FontAwesome from '@expo/vector-icons/FontAwesome';
import { DarkTheme, DefaultTheme, ThemeProvider as NavigationThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import 'react-native-reanimated';

import { ThemeProvider, useTheme } from '@/contexts/ThemeContext';
import { colors } from '@/constants/theme';
import { useOnboardingStore } from '@/store/onboarding-store';
import { useModelStore } from '@/store/model-store';
import { Onboarding } from '@/components/Onboarding';

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from 'expo-router';

export const unstable_settings = {
  initialRouteName: '(tabs)',
};

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
    ...FontAwesome.font,
  });

  // Expo Router uses Error Boundaries to catch errors in the navigation tree.
  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <ThemeProvider>
      <RootLayoutNav />
    </ThemeProvider>
  );
}

// Custom navigation themes that match our tactical design
const TacticalDarkTheme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    primary: colors.dark.accent,
    background: colors.dark.background,
    card: colors.dark.backgroundSecondary,
    text: colors.dark.text,
    border: colors.dark.border,
    notification: colors.dark.danger,
  },
};

const TacticalLightTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: colors.light.accent,
    background: colors.light.background,
    card: colors.light.backgroundSecondary,
    text: colors.light.text,
    border: colors.light.border,
    notification: colors.light.danger,
  },
};

function RootLayoutNav() {
  const { isDark } = useTheme();
  const { hasCompletedOnboarding, isLoading, loadOnboardingStatus } = useOnboardingStore();
  const { autoLoadBestModel } = useModelStore();

  // Load onboarding status on mount
  useEffect(() => {
    loadOnboardingStatus();
  }, []);

  // Auto-load the best downloaded model when app starts (after onboarding)
  useEffect(() => {
    if (hasCompletedOnboarding && !isLoading) {
      autoLoadBestModel();
    }
  }, [hasCompletedOnboarding, isLoading]);

  // Show nothing while loading onboarding status
  if (isLoading) {
    return null;
  }

  // Show onboarding if not completed
  if (!hasCompletedOnboarding) {
    return (
      <NavigationThemeProvider value={isDark ? TacticalDarkTheme : TacticalLightTheme}>
        <Onboarding />
      </NavigationThemeProvider>
    );
  }

  return (
    <NavigationThemeProvider value={isDark ? TacticalDarkTheme : TacticalLightTheme}>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      </Stack>
    </NavigationThemeProvider>
  );
}

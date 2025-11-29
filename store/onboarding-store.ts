import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ONBOARDING_KEY = 'surviveai_onboarding_complete';

interface OnboardingStore {
  hasCompletedOnboarding: boolean;
  isLoading: boolean;

  // Actions
  loadOnboardingStatus: () => Promise<void>;
  completeOnboarding: () => Promise<void>;
  resetOnboarding: () => Promise<void>; // For testing
}

export const useOnboardingStore = create<OnboardingStore>((set) => ({
  hasCompletedOnboarding: false,
  isLoading: true,

  loadOnboardingStatus: async () => {
    try {
      const value = await AsyncStorage.getItem(ONBOARDING_KEY);
      set({
        hasCompletedOnboarding: value === 'true',
        isLoading: false
      });
    } catch (error) {
      console.error('Failed to load onboarding status:', error);
      set({ isLoading: false });
    }
  },

  completeOnboarding: async () => {
    try {
      await AsyncStorage.setItem(ONBOARDING_KEY, 'true');
      set({ hasCompletedOnboarding: true });
    } catch (error) {
      console.error('Failed to save onboarding status:', error);
    }
  },

  resetOnboarding: async () => {
    try {
      await AsyncStorage.removeItem(ONBOARDING_KEY);
      set({ hasCompletedOnboarding: false });
    } catch (error) {
      console.error('Failed to reset onboarding:', error);
    }
  },
}));

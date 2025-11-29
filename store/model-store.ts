import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  downloadModel,
  initializeModel,
  isModelInitialized,
  unloadModel,
  DEFAULT_MODEL_ID,
  CACTUS_MODELS,
} from '@/lib/cactus/model';

interface ModelState {
  isLoaded: boolean;
  isLoading: boolean;
  loadProgress: number;
  error: string | null;
  currentModelId: string;
  loadedModelId: string | null;
}

interface ModelStore extends ModelState {
  selectModel: (modelId: string) => void;
  downloadAndLoad: (modelId?: string) => Promise<void>;
  unload: () => void;
  setError: (error: string | null) => void;
}

export const useModelStore = create<ModelStore>()(
  persist(
    (set, get) => ({
      // Initial state
      isLoaded: false,
      isLoading: false,
      loadProgress: 0,
      error: null,
      currentModelId: DEFAULT_MODEL_ID,
      loadedModelId: null,

      // Select a model (doesn't download/load yet)
      selectModel: (modelId: string) => {
        const { loadedModelId } = get();
        // If switching to a different model, mark as not loaded
        if (modelId !== loadedModelId) {
          set({ currentModelId: modelId, isLoaded: false });
        } else {
          set({ currentModelId: modelId });
        }
      },

      // Download and load a model
      downloadAndLoad: async (modelId?: string) => {
        const targetModelId = modelId || get().currentModelId;
        set({ isLoading: true, loadProgress: 0, error: null });

        try {
          console.log(`[ModelStore] Starting download for model: ${targetModelId}`);

          // Download with progress
          await downloadModel(targetModelId, (progress) => {
            console.log(`[ModelStore] Download progress: ${Math.round(progress * 100)}%`);
            set({ loadProgress: progress * 0.8 }); // 0-80% for download
          });

          console.log(`[ModelStore] Download complete, initializing model...`);
          set({ loadProgress: 0.9 });

          // Initialize the model
          await initializeModel(targetModelId);

          console.log(`[ModelStore] Model initialized successfully!`);
          set({
            isLoaded: true,
            isLoading: false,
            loadProgress: 1,
            currentModelId: targetModelId,
            loadedModelId: targetModelId,
          });
        } catch (error) {
          console.error(`[ModelStore] Error:`, error);
          const errorObj = error as any;
          let message = 'Unknown error';
          if (errorObj?.message) {
            message = errorObj.message;
          } else if (typeof error === 'string') {
            message = error;
          } else {
            message = JSON.stringify(error);
          }
          console.error(`[ModelStore] Error message: ${message}`);
          set({ isLoading: false, error: `Failed: ${message}`, loadProgress: 0 });
          throw error;
        }
      },

      // Unload the current model
      unload: () => {
        unloadModel();
        set({ isLoaded: false, loadedModelId: null });
      },

      // Set error state
      setError: (error) => set({ error }),
    }),
    {
      name: 'model-store',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({ currentModelId: state.currentModelId }),
      // Validate persisted model ID - reset to default if invalid
      onRehydrateStorage: () => (state) => {
        if (state && state.currentModelId && !CACTUS_MODELS[state.currentModelId]) {
          console.log(`[ModelStore] Invalid cached model "${state.currentModelId}", resetting to default`);
          state.currentModelId = DEFAULT_MODEL_ID;
        }
      },
    }
  )
);

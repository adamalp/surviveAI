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
  downloadedModels: string[]; // Track which models have been downloaded
}

interface ModelStore extends ModelState {
  selectModel: (modelId: string) => void;
  downloadAndLoad: (modelId?: string) => Promise<void>;
  unload: () => void;
  setError: (error: string | null) => void;
  isModelDownloaded: (modelId: string) => boolean;
  getBestDownloadedModel: () => string | null;
  autoLoadBestModel: () => Promise<void>;
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
      downloadedModels: [],

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
        const modelConfig = CACTUS_MODELS[targetModelId];
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
          // Add to downloaded models list if not already there
          const { downloadedModels } = get();
          const newDownloadedModels = downloadedModels.includes(targetModelId)
            ? downloadedModels
            : [...downloadedModels, targetModelId];

          set({
            isLoaded: true,
            isLoading: false,
            loadProgress: 1,
            currentModelId: targetModelId,
            loadedModelId: targetModelId,
            downloadedModels: newDownloadedModels,
          });
        } catch (error) {
          console.error(`[ModelStore] Error:`, error);
          const errorObj = error as Error | undefined;
          let message: string;

          if (errorObj?.message) {
            // Error already has a user-friendly message from model.ts
            message = errorObj.message;
          } else if (typeof error === 'string') {
            message = error;
          } else {
            message = `Failed to download ${modelConfig?.name || targetModelId}. Please try again.`;
          }

          console.error(`[ModelStore] Error message: ${message}`);
          set({ isLoading: false, error: message, loadProgress: 0 });
          throw new Error(message);
        }
      },

      // Unload the current model
      unload: () => {
        unloadModel();
        set({ isLoaded: false, loadedModelId: null });
      },

      // Set error state
      setError: (error) => set({ error }),

      // Check if a model is downloaded
      isModelDownloaded: (modelId: string) => {
        return get().downloadedModels.includes(modelId);
      },

      // Get the best (highest quality) downloaded model
      getBestDownloadedModel: () => {
        const { downloadedModels } = get();
        if (downloadedModels.length === 0) return null;

        // Sort by quality rating (highest first)
        const sortedModels = downloadedModels
          .filter(id => CACTUS_MODELS[id]) // Filter out invalid model IDs
          .sort((a, b) => {
            const qualityA = CACTUS_MODELS[a]?.quality || 0;
            const qualityB = CACTUS_MODELS[b]?.quality || 0;
            return qualityB - qualityA;
          });

        return sortedModels[0] || null;
      },

      // Automatically load the best downloaded model
      autoLoadBestModel: async () => {
        const { isLoaded, isLoading, getBestDownloadedModel, downloadAndLoad } = get();

        // Don't auto-load if already loaded or currently loading
        if (isLoaded || isLoading) {
          console.log('[ModelStore] Skipping auto-load: model already loaded or loading');
          return;
        }

        const bestModelId = getBestDownloadedModel();
        if (!bestModelId) {
          console.log('[ModelStore] No downloaded models available for auto-load');
          return;
        }

        console.log(`[ModelStore] Auto-loading best model: ${bestModelId} (quality: ${CACTUS_MODELS[bestModelId]?.quality})`);
        try {
          await downloadAndLoad(bestModelId);
        } catch (error) {
          console.error('[ModelStore] Auto-load failed:', error);
          // Don't throw - this is a background operation
        }
      },
    }),
    {
      name: 'model-store',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        currentModelId: state.currentModelId,
        downloadedModels: state.downloadedModels,
      }),
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

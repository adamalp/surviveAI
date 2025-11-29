import { CactusLM } from 'cactus-react-native';
import { ModelInfo } from '@/types';

// Singleton instance
let lmInstance: CactusLM | null = null;
// Track initialization state (since isInitialized is private on CactusLM)
let modelInitialized = false;

// Available models from Cactus SDK
// See: https://cactuscompute.com/docs/react-native
// Model IDs use simplified format (lowercase, no org prefix)
export const CACTUS_MODELS: Record<string, ModelConfig> = {
  'gemma3-0.3': {
    id: 'gemma3-0.3',
    name: 'Gemma 3 270M',
    description: 'Smallest Google model. Ultra-fast, basic responses.',
    size: '~172MB',
    quality: 1,
    speed: 5,
    supportsVision: false,
    supportsToolCalling: false, // Too small for function calling
  },
  'qwen3-0.6': {
    id: 'qwen3-0.6',
    name: 'Qwen3 0.6B',
    description: 'Small and fast. Good for quick questions.',
    size: '~394MB',
    quality: 2,
    speed: 5,
    supportsVision: false,
    supportsToolCalling: false, // Too small for function calling
  },
  'lfm2-vl-450m': {
    id: 'lfm2-vl-450m',
    name: 'LFM2 Vision 450M',
    description: 'Vision model. Can analyze images and photos.',
    size: '~420MB',
    quality: 3,
    speed: 4,
    supportsVision: true,
    supportsToolCalling: false, // Too small for function calling
  },
  'smollm2-0.4': {
    id: 'smollm2-0.4',
    name: 'SmolLM2 360M',
    description: 'HuggingFace model. Compact and fast.',
    size: '~227MB',
    quality: 2,
    speed: 5,
    supportsVision: false,
    supportsToolCalling: false, // Too small for function calling
  },
  'gemma3-1': {
    id: 'gemma3-1',
    name: 'Gemma 3 1B',
    description: 'Google model. Good balance of speed and quality.',
    size: '~700MB',
    quality: 3,
    speed: 4,
    supportsVision: false,
    supportsToolCalling: false, // 1B models have limited function calling
  },
  'qwen3-1.7': {
    id: 'qwen3-1.7',
    name: 'Qwen3 1.7B',
    description: 'Great balance of quality and speed. Recommended.',
    size: '~1.1GB',
    quality: 4,
    speed: 3,
    supportsVision: false,
    supportsToolCalling: false, // Disabled for better UX - non-streaming tool detection causes delay
  },
  'smollm2-1.7': {
    id: 'smollm2-1.7',
    name: 'SmolLM2 1.7B',
    description: 'HuggingFace model. Optimized for instruction following.',
    size: '~1.1GB',
    quality: 4,
    speed: 3,
    supportsVision: false,
    supportsToolCalling: false, // Disabled for better UX - non-streaming tool detection causes delay
  },
};

export interface ModelConfig {
  id: string;
  name: string;
  description: string;
  size: string;
  quality: number; // 1-5 rating
  speed: number;   // 1-5 rating
  supportsVision: boolean;
  supportsToolCalling: boolean; // Whether model can properly execute function calls
}

export const DEFAULT_MODEL_ID = 'qwen3-0.6';

// Get or create the CactusLM instance
export const getCactusLM = (modelId: string = DEFAULT_MODEL_ID): CactusLM => {
  if (!lmInstance || lmInstance['model'] !== modelId) {
    // Destroy old instance before creating new one to release resources
    if (lmInstance) {
      try {
        lmInstance.destroy();
      } catch (e) {
        console.warn('[CactusModel] Error destroying old instance:', e);
      }
      modelInitialized = false;
    }
    lmInstance = new CactusLM({
      model: modelId,
      contextSize: 2048,
    });
  }
  return lmInstance;
};

// Parse error for user-friendly messages
const parseDownloadError = (error: unknown, modelId: string): string => {
  const errorStr = error instanceof Error ? error.message : String(error);
  const modelConfig = CACTUS_MODELS[modelId];
  const modelName = modelConfig?.name || modelId;

  // Common error patterns
  if (errorStr.includes('network') || errorStr.includes('Network') || errorStr.includes('timeout')) {
    return `Network error downloading ${modelName}. Check your internet connection and try again.`;
  }
  if (errorStr.includes('disk') || errorStr.includes('storage') || errorStr.includes('space')) {
    return `Not enough storage space for ${modelName} (${modelConfig?.size || 'unknown size'}). Free up space and try again.`;
  }
  if (errorStr.includes('not found') || errorStr.includes('404') || errorStr.includes('unavailable')) {
    return `Model ${modelName} is not available. Try a different model.`;
  }
  if (errorStr.includes('cancelled') || errorStr.includes('aborted')) {
    return `Download cancelled. Tap to retry.`;
  }
  if (errorStr.includes('permission')) {
    return `Storage permission denied. Check app permissions in Settings.`;
  }

  // Return original error with model context
  return `${modelName} download failed: ${errorStr}`;
};

// Download the model
export const downloadModel = async (
  modelId: string = DEFAULT_MODEL_ID,
  onProgress?: (progress: number) => void
): Promise<void> => {
  console.log(`[CactusModel] Downloading model: ${modelId}`);

  // Validate model ID
  if (!CACTUS_MODELS[modelId]) {
    throw new Error(`Unknown model: ${modelId}. Available models: ${Object.keys(CACTUS_MODELS).join(', ')}`);
  }

  try {
    const lm = getCactusLM(modelId);
    console.log(`[CactusModel] Got LM instance, starting download...`);
    await lm.download({ onProgress });
    console.log(`[CactusModel] Download completed for: ${modelId}`);
  } catch (error) {
    console.error(`[CactusModel] Download failed:`, error);
    const friendlyMessage = parseDownloadError(error, modelId);
    throw new Error(friendlyMessage);
  }
};

// Initialize the model (must be downloaded first)
export const initializeModel = async (modelId: string = DEFAULT_MODEL_ID): Promise<CactusLM> => {
  const lm = getCactusLM(modelId);
  await lm.init();
  modelInitialized = true;
  return lm;
};

// Check if model is initialized
export const isModelInitialized = (): boolean => {
  return modelInitialized && lmInstance !== null;
};

// Get the current instance
export const getModel = (): CactusLM | null => {
  return lmInstance;
};

// Unload the model - IMPORTANT: Always call destroy() to release resources
export const unloadModel = (): void => {
  if (lmInstance) {
    try {
      lmInstance.destroy();
    } catch (e) {
      console.warn('[CactusModel] Error destroying instance:', e);
    }
  }
  lmInstance = null;
  modelInitialized = false;
};

// Check if a model is downloaded
export const isModelDownloaded = async (modelId: string): Promise<boolean> => {
  try {
    const lm = new CactusLM({ model: modelId, contextSize: 2048 });
    // The SDK's download method typically returns immediately if already downloaded
    // We can use the isDownloaded property if available, otherwise check via a quick download attempt
    if ('isDownloaded' in lm && typeof (lm as any).isDownloaded === 'function') {
      return await (lm as any).isDownloaded();
    }
    // Fallback: return false if we can't determine
    return false;
  } catch {
    return false;
  }
};

// Check all models for download status
export const checkAllModelsDownloaded = async (): Promise<Record<string, boolean>> => {
  const results: Record<string, boolean> = {};
  for (const modelId of Object.keys(CACTUS_MODELS)) {
    results[modelId] = await isModelDownloaded(modelId);
  }
  return results;
};

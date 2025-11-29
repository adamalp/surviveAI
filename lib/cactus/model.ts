import { CactusLM } from 'cactus-react-native';
import { ModelInfo } from '@/types';

// Singleton instance
let lmInstance: CactusLM | null = null;

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
  },
  'qwen3-0.6': {
    id: 'qwen3-0.6',
    name: 'Qwen3 0.6B',
    description: 'Small and fast. Good for quick questions.',
    size: '~394MB',
    quality: 2,
    speed: 5,
    supportsVision: false,
  },
  'lfm2-vl-450m': {
    id: 'lfm2-vl-450m',
    name: 'LFM2 Vision 450M',
    description: 'Vision model. Can analyze images and photos.',
    size: '~420MB',
    quality: 3,
    speed: 4,
    supportsVision: true,
  },
  'smollm2-0.4': {
    id: 'smollm2-0.4',
    name: 'SmolLM2 360M',
    description: 'HuggingFace model. Compact and fast.',
    size: '~227MB',
    quality: 2,
    speed: 5,
    supportsVision: false,
  },
  'gemma3-1': {
    id: 'gemma3-1',
    name: 'Gemma 3 1B',
    description: 'Google model. Good balance of speed and quality.',
    size: '~700MB',
    quality: 3,
    speed: 4,
    supportsVision: false,
  },
  'qwen3-1.7': {
    id: 'qwen3-1.7',
    name: 'Qwen3 1.7B',
    description: 'Great balance of quality and speed. Recommended.',
    size: '~1.1GB',
    quality: 4,
    speed: 3,
    supportsVision: false,
  },
  'smollm2-1.7': {
    id: 'smollm2-1.7',
    name: 'SmolLM2 1.7B',
    description: 'HuggingFace model. Optimized for instruction following.',
    size: '~1.1GB',
    quality: 4,
    speed: 3,
    supportsVision: false,
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
}

export const DEFAULT_MODEL_ID = 'qwen3-0.6';

// Get or create the CactusLM instance
export const getCactusLM = (modelId: string = DEFAULT_MODEL_ID): CactusLM => {
  if (!lmInstance || lmInstance['model'] !== modelId) {
    lmInstance = new CactusLM({
      model: modelId,
      contextSize: 2048,
    });
  }
  return lmInstance;
};

// Download the model
export const downloadModel = async (
  modelId: string = DEFAULT_MODEL_ID,
  onProgress?: (progress: number) => void
): Promise<void> => {
  console.log(`[CactusModel] Downloading model: ${modelId}`);
  try {
    const lm = getCactusLM(modelId);
    console.log(`[CactusModel] Got LM instance, starting download...`);
    await lm.download({ onProgress });
    console.log(`[CactusModel] Download completed for: ${modelId}`);
  } catch (error) {
    console.error(`[CactusModel] Download failed:`, error);
    throw error;
  }
};

// Initialize the model (must be downloaded first)
export const initializeModel = async (modelId: string = DEFAULT_MODEL_ID): Promise<CactusLM> => {
  const lm = getCactusLM(modelId);
  await lm.init();
  return lm;
};

// Check if model is initialized
export const isModelInitialized = (): boolean => {
  return lmInstance?.isInitialized ?? false;
};

// Get the current instance
export const getModel = (): CactusLM | null => {
  return lmInstance;
};

// Unload the model
export const unloadModel = (): void => {
  lmInstance = null;
};

import { CactusSTT } from 'cactus-react-native';
import { logger } from '@/constants/config';

// Singleton STT instance
let sttInstance: CactusSTT | null = null;
let sttInitialized = false;
let sttDownloaded = false;

// Available STT models
export const STT_MODELS = {
  'whisper-small': {
    id: 'whisper-small',
    name: 'Whisper Small',
    description: 'OpenAI Whisper small model for speech recognition',
    size: '~244MB',
  },
};

export const DEFAULT_STT_MODEL = 'whisper-small';

// Get or create the CactusSTT instance
export const getCactusSTT = (modelId: string = DEFAULT_STT_MODEL): CactusSTT => {
  if (!sttInstance) {
    sttInstance = new CactusSTT({
      model: modelId,
    });
  }
  return sttInstance;
};

// Download the STT model
export const downloadSTTModel = async (
  modelId: string = DEFAULT_STT_MODEL,
  onProgress?: (progress: number) => void
): Promise<void> => {
  logger.debug('STT', `Downloading model: ${modelId}`);

  try {
    const stt = getCactusSTT(modelId);
    await stt.download({ onProgress });
    sttDownloaded = true;
    logger.debug('STT', 'Download completed');
  } catch (error) {
    logger.error('STT', 'Download failed', error);
    throw error;
  }
};

// Initialize the STT model
export const initializeSTT = async (modelId: string = DEFAULT_STT_MODEL): Promise<void> => {
  logger.debug('STT', 'Initializing...');

  try {
    const stt = getCactusSTT(modelId);
    await stt.init();
    sttInitialized = true;
    logger.debug('STT', 'Initialized');
  } catch (error) {
    logger.error('STT', 'Initialization failed', error);
    throw error;
  }
};

// Check if STT is ready
export const isSTTReady = (): boolean => {
  return sttDownloaded && sttInitialized && sttInstance !== null;
};

// Check if STT model is downloaded
export const isSTTDownloaded = (): boolean => {
  return sttDownloaded;
};

// Transcribe audio file
export const transcribeAudio = async (
  audioFilePath: string,
  onToken?: (token: string) => void
): Promise<{ text: string; success: boolean }> => {
  if (!sttInstance || !sttInitialized) {
    throw new Error('STT not initialized. Call initializeSTT first.');
  }

  logger.debug('STT', `Transcribing: ${audioFilePath}`);

  try {
    const result = await sttInstance.transcribe({
      audioFilePath,
      onToken,
    });

    logger.debug('STT', `Transcription complete: ${result.response.slice(0, 50)}...`);

    return {
      text: result.response,
      success: result.success,
    };
  } catch (error) {
    logger.error('STT', 'Transcription failed', error);
    throw error;
  }
};

// Stop any ongoing transcription
export const stopSTT = (): void => {
  if (sttInstance) {
    sttInstance.stop();
  }
};

// Reset STT state
export const resetSTT = (): void => {
  if (sttInstance) {
    sttInstance.reset();
  }
};

// Destroy STT instance
export const destroySTT = (): void => {
  if (sttInstance) {
    sttInstance.destroy();
    sttInstance = null;
    sttInitialized = false;
    sttDownloaded = false;
  }
};

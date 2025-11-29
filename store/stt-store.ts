import { create } from 'zustand';
import {
  downloadSTTModel,
  initializeSTT,
  transcribeAudio,
  isSTTReady,
  isSTTDownloaded,
  stopSTT,
  destroySTT,
  DEFAULT_STT_MODEL,
} from '@/lib/cactus/stt';
import { Audio } from 'expo-av';
import * as FileSystem from 'expo-file-system';

interface STTStore {
  // State
  isDownloading: boolean;
  isDownloaded: boolean;
  isInitializing: boolean;
  isInitialized: boolean;
  isRecording: boolean;
  isTranscribing: boolean;
  downloadProgress: number;
  transcription: string;
  error: string | null;
  recording: Audio.Recording | null;

  // Actions
  downloadModel: () => Promise<void>;
  initializeModel: () => Promise<void>;
  startRecording: () => Promise<void>;
  stopRecording: () => Promise<string>;
  cancelRecording: () => Promise<void>;
  transcribeFile: (filePath: string) => Promise<string>;
  reset: () => void;
  setError: (error: string | null) => void;
}

export const useSTTStore = create<STTStore>((set, get) => ({
  // Initial state
  isDownloading: false,
  isDownloaded: false,
  isInitializing: false,
  isInitialized: false,
  isRecording: false,
  isTranscribing: false,
  downloadProgress: 0,
  transcription: '',
  error: null,
  recording: null,

  // Download the STT model
  downloadModel: async () => {
    if (get().isDownloading || get().isDownloaded) return;

    set({ isDownloading: true, error: null, downloadProgress: 0 });

    try {
      await downloadSTTModel(DEFAULT_STT_MODEL, (progress) => {
        set({ downloadProgress: progress });
      });
      set({ isDownloading: false, isDownloaded: true, downloadProgress: 1 });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to download STT model';
      set({ isDownloading: false, error: message });
      throw error;
    }
  },

  // Initialize the STT model
  initializeModel: async () => {
    if (get().isInitializing || get().isInitialized) return;
    if (!get().isDownloaded) {
      await get().downloadModel();
    }

    set({ isInitializing: true, error: null });

    try {
      await initializeSTT(DEFAULT_STT_MODEL);
      set({ isInitializing: false, isInitialized: true });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to initialize STT model';
      set({ isInitializing: false, error: message });
      throw error;
    }
  },

  // Start audio recording
  startRecording: async () => {
    if (get().isRecording) return;

    try {
      // Request permissions
      const permission = await Audio.requestPermissionsAsync();
      if (!permission.granted) {
        set({ error: 'Microphone permission denied' });
        return;
      }

      // Configure audio mode
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      // Create and start recording with WAV format for Whisper compatibility
      // Whisper requires: 16kHz sample rate, mono, 16-bit PCM
      const { recording } = await Audio.Recording.createAsync({
        isMeteringEnabled: false,
        android: {
          extension: '.wav',
          outputFormat: Audio.AndroidOutputFormat.DEFAULT,
          audioEncoder: Audio.AndroidAudioEncoder.DEFAULT,
          sampleRate: 16000,
          numberOfChannels: 1,
          bitRate: 256000,
        },
        ios: {
          extension: '.wav',
          audioQuality: Audio.IOSAudioQuality.HIGH,
          sampleRate: 16000,
          numberOfChannels: 1,
          bitRate: 256000,
          linearPCMBitDepth: 16,
          linearPCMIsBigEndian: false,
          linearPCMIsFloat: false,
        },
        web: {
          mimeType: 'audio/wav',
          bitsPerSecond: 256000,
        },
      });

      set({ recording, isRecording: true, error: null, transcription: '' });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to start recording';
      set({ error: message });
      throw error;
    }
  },

  // Stop recording and transcribe
  stopRecording: async () => {
    const { recording } = get();
    if (!recording) {
      throw new Error('No recording in progress');
    }

    set({ isRecording: false, isTranscribing: true });

    try {
      // Stop the recording
      await recording.stopAndUnloadAsync();
      const uri = recording.getURI();

      if (!uri) {
        throw new Error('No recording URI');
      }

      // Reset audio mode
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: false,
      });

      // Ensure STT is initialized
      if (!get().isInitialized) {
        await get().initializeModel();
      }

      // Transcribe the audio - convert file:// URI to plain path
      const filePath = uri.startsWith('file://') ? uri.replace('file://', '') : uri;
      const result = await transcribeAudio(filePath);

      // Clean up the temp file
      try {
        await FileSystem.deleteAsync(uri);
      } catch {
        // Ignore cleanup errors
      }

      set({
        recording: null,
        isTranscribing: false,
        transcription: result.text,
      });

      return result.text;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to transcribe';
      set({ recording: null, isTranscribing: false, error: message });
      throw error;
    }
  },

  // Cancel recording without transcribing
  cancelRecording: async () => {
    const { recording } = get();
    if (!recording) return;

    try {
      await recording.stopAndUnloadAsync();
      const uri = recording.getURI();
      if (uri) {
        await FileSystem.deleteAsync(uri);
      }
    } catch {
      // Ignore errors
    }

    await Audio.setAudioModeAsync({
      allowsRecordingIOS: false,
    });

    set({ recording: null, isRecording: false, transcription: '' });
  },

  // Transcribe an existing audio file
  transcribeFile: async (filePath: string) => {
    set({ isTranscribing: true, error: null });

    try {
      // Ensure STT is initialized
      if (!get().isInitialized) {
        await get().initializeModel();
      }

      const result = await transcribeAudio(filePath);
      set({ isTranscribing: false, transcription: result.text });
      return result.text;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to transcribe';
      set({ isTranscribing: false, error: message });
      throw error;
    }
  },

  // Reset state
  reset: () => {
    stopSTT();
    set({
      isTranscribing: false,
      transcription: '',
      error: null,
    });
  },

  // Set error
  setError: (error) => set({ error }),
}));

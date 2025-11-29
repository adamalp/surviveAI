import { ModelInfo } from '@/types';

// Available models for download
export const AVAILABLE_MODELS: ModelInfo[] = [
  {
    name: 'Phi-3 Mini',
    filename: 'phi-3-mini-4k-instruct-q4.gguf',
    size: 2_200_000_000, // ~2.2GB
    url: 'https://huggingface.co/microsoft/Phi-3-mini-4k-instruct-gguf/resolve/main/Phi-3-mini-4k-instruct-q4.gguf',
    description: 'Best balance of quality and size. Recommended for most devices.',
  },
  {
    name: 'Qwen3 0.6B',
    filename: 'qwen3-0.6b-q4_k_m.gguf',
    size: 400_000_000, // ~400MB
    url: 'https://huggingface.co/Qwen/Qwen3-0.6B-GGUF/resolve/main/qwen3-0.6b-q4_k_m.gguf',
    description: 'Lightweight and fast. Good for older devices.',
  },
];

export const DEFAULT_MODEL = AVAILABLE_MODELS[0];

// System prompt for survival assistant - optimized for small on-device models
// Keep it simple - small models struggle with complex instructions
export const SURVIVAL_SYSTEM_PROMPT = `You are a survival expert. Give short, direct answers.

Rules:
- Answer in 3-5 numbered steps
- Keep it under 100 words
- End with one follow-up question the user might ask
- Use plain text only, no special characters

Example format:
1. First step
2. Second step
3. Third step

Follow-up: "Would you like to know about [topic]?"

Use any SURVIVAL KNOWLEDGE provided below.`;

// Model inference parameters - optimized for small models
export const DEFAULT_INFERENCE_PARAMS = {
  n_predict: 512,
  temperature: 0.7,
  top_p: 0.9,
  stop: ['\n\nUser:', '\n\nHuman:'],
};

// Optimized inference parameters for small on-device models
// Lower temperature = more deterministic, less hallucination
export const SMALL_MODEL_PARAMS = {
  temperature: 0.3,
  top_p: 0.85,
  maxTokens: 1024, // Enough for full responses
  repetition_penalty: 1.1,
};

// Context window size
export const DEFAULT_CONTEXT_SIZE = 2048;

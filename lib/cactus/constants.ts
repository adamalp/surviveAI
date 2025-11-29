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
// Kept short (<300 tokens) with clear, imperative instructions
export const SURVIVAL_SYSTEM_PROMPT = `You are a survival expert. Give clear, step-by-step advice.

RULES:
- Use the KNOWLEDGE section below as your primary source of truth
- Give numbered steps for procedures
- Be brief - this may be an emergency
- If unsure, say "I'm not certain" and share what you do know
- For serious injuries, remind them to seek professional help if possible

FORMAT:
1. Start with the most urgent action
2. Give steps in order
3. End with warning signs to watch for

KNOWLEDGE USAGE: When "RELEVANT SURVIVAL KNOWLEDGE" appears below, use it directly in your response. This information has been verified.`;

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
  maxTokens: 512,
  repetition_penalty: 1.1,
};

// Context window size
export const DEFAULT_CONTEXT_SIZE = 2048;

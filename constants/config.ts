// Centralized configuration for app-wide constants
// Avoids magic numbers scattered throughout the codebase

export const CONFIG = {
  // UI Timing
  SCROLL_TO_BOTTOM_DELAY: 100, // ms delay before scrolling chat to bottom
  DEBOUNCE_DELAY: 300, // ms for input debouncing

  // Device Updates
  BATTERY_UPDATE_INTERVAL: 60000, // 60 seconds between battery checks
  LOCATION_UPDATE_INTERVAL: 30000, // 30 seconds between location updates

  // AI Model
  MODEL_MAX_TOKENS: 1024, // Maximum tokens for model response
  MODEL_CONTEXT_SIZE: 2048, // Context window size
  RESPONSE_TIMEOUT: 60000, // 60 seconds before timing out model response
  KNOWLEDGE_SEARCH_LIMIT: 3, // Number of knowledge entries to retrieve

  // Storage
  MAX_MESSAGES_IN_MEMORY: 500, // Maximum messages to keep in memory per conversation
  CONVERSATION_PREVIEW_LENGTH: 100, // Characters for conversation preview

  // Quality Thresholds
  MIN_RESPONSE_LENGTH: 20, // Minimum acceptable response length
  MAX_UNCERTAINTY_RATIO: 0.3, // Maximum ratio of uncertainty phrases

  // Cache
  CACHE_MIN_SCORE_THRESHOLD: 15, // Minimum score for cache match
  CACHE_HIGH_CONFIDENCE_THRESHOLD: 40, // High confidence cache match
} as const;

// Development flags
export const DEV_FLAGS = {
  ENABLE_DEBUG_LOGGING: __DEV__,
  ENABLE_PERFORMANCE_MONITORING: __DEV__,
} as const;

// Logger utility that respects DEV_FLAGS
export const logger = {
  debug: (tag: string, message: string, data?: unknown) => {
    if (DEV_FLAGS.ENABLE_DEBUG_LOGGING) {
      console.log(`[${tag}] ${message}`, data ?? '');
    }
  },
  warn: (tag: string, message: string, error?: unknown) => {
    if (DEV_FLAGS.ENABLE_DEBUG_LOGGING) {
      console.warn(`[${tag}] ${message}`, error ?? '');
    }
  },
  error: (tag: string, message: string, error?: unknown) => {
    // Always log errors
    console.error(`[${tag}] ${message}`, error ?? '');
  },
};

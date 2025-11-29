import { getModel, isModelInitialized } from './model';
import { SURVIVAL_SYSTEM_PROMPT, SMALL_MODEL_PARAMS } from './constants';
import { ChatMessage, DeviceContext, ResponseSource } from '@/types';
import { getRelevantKnowledge, searchKnowledge } from '@/lib/knowledge';
import { analyzeResponseQuality } from './quality';

// Build system prompt with optional device context and knowledge
const buildSystemPrompt = (
  context?: DeviceContext,
  knowledgeContext?: string
): string => {
  let prompt = SURVIVAL_SYSTEM_PROMPT;

  // Add device context if available
  if (context) {
    const locationStr = context.location.latitude && context.location.longitude
      ? `${context.location.latitude.toFixed(4)}°, ${context.location.longitude.toFixed(4)}°`
      : 'Unknown';

    const elevationStr = context.location.elevation_m !== null
      ? `${Math.round(context.location.elevation_m)}m`
      : 'Unknown';

    const batteryStr = context.device.battery_percent !== null
      ? `${context.device.battery_percent}%${context.device.is_charging ? ' (charging)' : ''}`
      : 'Unknown';

    const emergencyStr = context.user_state.emergency_mode
      ? `\n- EMERGENCY MODE: ${context.user_state.emergency_mode.toUpperCase()}`
      : '';

    const contextBlock = `CURRENT DEVICE CONTEXT:
- Location: ${locationStr}
- Elevation: ${elevationStr}
- Time: ${context.time.local_time} ${context.time.timezone}
- Battery: ${batteryStr}
- Network: ${context.network.is_offline ? 'OFFLINE' : 'Online'}${emergencyStr}

Use this context to provide location-aware, time-appropriate advice.
${context.device.battery_percent !== null && context.device.battery_percent < 20 ? '- Battery is low. Keep responses concise to help preserve battery.\n' : ''}
`;

    prompt = contextBlock + prompt;
  }

  // Add knowledge context if available
  if (knowledgeContext) {
    prompt = prompt + '\n' + knowledgeContext;
  }

  return prompt;
};

// Message format for Cactus API (with optional images)
interface CactusMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
  images?: string[];
}

// Format messages for the Cactus API with knowledge injection
const formatMessages = (
  messages: ChatMessage[],
  context?: DeviceContext,
  knowledgeContext?: string
): CactusMessage[] => {
  return [
    { role: 'system', content: buildSystemPrompt(context, knowledgeContext) },
    ...messages.map((m) => {
      const msg: CactusMessage = {
        role: m.role as 'user' | 'assistant',
        content: m.content,
      };
      // Include images if present (for vision models)
      if (m.images && m.images.length > 0) {
        msg.images = m.images;
      }
      return msg;
    }),
  ];
};

// Get the last user message for knowledge lookup
const getLastUserMessage = (messages: ChatMessage[]): string | undefined => {
  for (let i = messages.length - 1; i >= 0; i--) {
    if (messages[i].role === 'user') {
      return messages[i].content;
    }
  }
  return undefined;
};

// Generate a chat completion with automatic knowledge injection
export const generateCompletion = async (
  messages: ChatMessage[],
  context?: DeviceContext
): Promise<string> => {
  const model = getModel();
  if (!model || !isModelInitialized()) {
    throw new Error('Model not loaded. Please initialize the model first.');
  }

  // Auto-inject relevant knowledge based on user's question
  const lastUserMessage = getLastUserMessage(messages);
  const knowledgeContext = lastUserMessage
    ? getRelevantKnowledge(lastUserMessage)
    : undefined;

  const formattedMessages = formatMessages(messages, context, knowledgeContext);

  console.log('[Chat] Knowledge injected:', knowledgeContext ? 'Yes' : 'No');

  const result = await model.complete({
    messages: formattedMessages,
    options: {
      maxTokens: 1024,
    },
  });

  return result?.response || '';
};

// Generate a streaming chat completion with automatic knowledge injection
export const generateStreamingCompletion = async (
  messages: ChatMessage[],
  onToken: (token: string) => void,
  context?: DeviceContext
): Promise<string> => {
  const model = getModel();
  if (!model || !isModelInitialized()) {
    throw new Error('Model not loaded. Please initialize the model first.');
  }

  // Auto-inject relevant knowledge based on user's question
  const lastUserMessage = getLastUserMessage(messages);
  const knowledgeContext = lastUserMessage
    ? getRelevantKnowledge(lastUserMessage)
    : undefined;

  const formattedMessages = formatMessages(messages, context, knowledgeContext);

  console.log('[Chat] Streaming with knowledge:', knowledgeContext ? 'Yes' : 'No');

  const result = await model.complete({
    messages: formattedMessages,
    options: {
      maxTokens: 1024,
    },
    onToken,
  });

  return result?.response || '';
};

// Quick survival question (single turn)
export const askSurvivalQuestion = async (question: string): Promise<string> => {
  const messages: ChatMessage[] = [
    {
      id: 'q1',
      conversationId: 'temp',
      role: 'user',
      content: question,
      timestamp: Date.now(),
    },
  ];

  return generateCompletion(messages);
};

// ============= SMART RESPONSE SYSTEM =============
// ALWAYS uses on-device model with knowledge grounding for accurate responses

export interface SmartResponse {
  response: string;
  source: ResponseSource;
  knowledgeEntryId?: string;
  qualityScore?: number;
}

// Generate a smart response - ALWAYS uses on-device model with knowledge grounding
// This demonstrates deep Cactus SDK integration and true edge AI capabilities
export const generateSmartResponse = async (
  messages: ChatMessage[],
  onToken: (token: string) => void,
  context?: DeviceContext
): Promise<SmartResponse> => {
  const lastUserMessage = getLastUserMessage(messages);

  if (!lastUserMessage) {
    return {
      response: "I didn't catch that. Could you please ask a question?",
      source: 'model',
    };
  }

  // 1. Get relevant knowledge to inject as context (improves model accuracy)
  const knowledgeEntries = searchKnowledge(lastUserMessage, 2);
  const knowledgeContext = getRelevantKnowledge(lastUserMessage);

  console.log('[SmartResponse] Knowledge injected:', knowledgeEntries.length > 0 ? 'Yes' : 'No');

  // 2. ALWAYS generate response with on-device model
  let rawResponse = '';
  try {
    const fullResponse = await generateStreamingCompletion(
      messages,
      (token) => {
        rawResponse += token;
        onToken(token);
      },
      context
    );
    rawResponse = fullResponse || rawResponse;
  } catch (error) {
    console.error('[SmartResponse] Model generation failed:', error);
    throw error;
  }

  // 3. Analyze response quality (for logging/debugging, not replacement)
  const quality = analyzeResponseQuality(rawResponse, knowledgeContext);
  console.log('[SmartResponse] Quality score:', quality.score, 'Issues:', quality.issues);

  // 4. Check if we have related knowledge (for UI indicator only)
  const hasKnowledgeGrounding = knowledgeEntries.length > 0;

  // 5. Return model response with metadata
  return {
    response: rawResponse,
    source: hasKnowledgeGrounding ? 'knowledge-grounded' : 'model',
    knowledgeEntryId: knowledgeEntries[0]?.id,
    qualityScore: quality.score,
  };
};

// Simple wrapper for cases where we don't need streaming
export const getSmartAnswer = async (
  question: string,
  context?: DeviceContext
): Promise<SmartResponse> => {
  let response = '';

  const messages: ChatMessage[] = [
    {
      id: 'q1',
      conversationId: 'temp',
      role: 'user',
      content: question,
      timestamp: Date.now(),
    },
  ];

  return generateSmartResponse(
    messages,
    (token) => { response += token; },
    context
  );
};

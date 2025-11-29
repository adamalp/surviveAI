import { getModel } from './model';
import { SURVIVAL_SYSTEM_PROMPT } from './constants';
import { ChatMessage, DeviceContext } from '@/types';
import { getRelevantKnowledge, KNOWLEDGE_TOOL, executeKnowledgeTool, TopicId } from '@/lib/knowledge';

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
  if (!model || !model.isInitialized) {
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
  if (!model || !model.isInitialized) {
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
      role: 'user',
      content: question,
      timestamp: Date.now(),
    },
  ];

  return generateCompletion(messages);
};

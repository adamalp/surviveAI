import { getModel, isModelInitialized, CACTUS_MODELS } from './model';
import { SURVIVAL_SYSTEM_PROMPT, TOOL_CALLING_SYSTEM_PROMPT, SMALL_MODEL_PARAMS, DEFAULT_INFERENCE_PARAMS } from './constants';
import { ChatMessage, DeviceContext, ResponseSource, PerformanceMetrics } from '@/types';
import { getRelevantKnowledge, searchKnowledge } from '@/lib/knowledge';
import { analyzeResponseQuality } from './quality';
import { logger } from '@/constants/config';
import { SURVIVAL_TOOLS, executeTool, formatToolResultForMessages } from './tools';
import { useModelStore } from '@/store/model-store';

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

  logger.debug('Chat', 'Knowledge injected', knowledgeContext ? 'Yes' : 'No');

  const result = await model.complete({
    messages: formattedMessages,
    options: {
      maxTokens: SMALL_MODEL_PARAMS.maxTokens,
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

  logger.debug('Chat', 'Streaming with knowledge', knowledgeContext ? 'Yes' : 'No');

  const result = await model.complete({
    messages: formattedMessages,
    options: {
      maxTokens: SMALL_MODEL_PARAMS.maxTokens,
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
// Uses on-device model with tool calling for dynamic knowledge retrieval

export interface SmartResponse {
  response: string;
  source: ResponseSource;
  knowledgeEntryId?: string;
  qualityScore?: number;
  usedToolCalling?: boolean;
  metrics?: PerformanceMetrics;
}

// Result type for generateWithToolCalling
interface ToolCallingResult {
  response: string;
  usedTools: boolean;
  toolTopic?: string;
  metrics?: PerformanceMetrics;
}

// Generate completion with tool calling support
const generateWithToolCalling = async (
  messages: ChatMessage[],
  onToken: (token: string) => void,
  context?: DeviceContext
): Promise<ToolCallingResult> => {
  const model = getModel();
  if (!model || !isModelInitialized()) {
    throw new Error('Model not loaded. Please initialize the model first.');
  }

  const formattedMessages = formatMessages(messages, context);

  logger.debug('ToolCalling', 'Starting completion with tools');

  // First call - may return function calls
  const result = await model.complete({
    messages: formattedMessages,
    tools: SURVIVAL_TOOLS,
    options: {
      maxTokens: SMALL_MODEL_PARAMS.maxTokens,
    },
    onToken,
  });

  // Check if model wants to call a tool
  if (result.functionCalls && result.functionCalls.length > 0) {
    const functionCall = result.functionCalls[0];
    logger.debug('ToolCalling', `Model requested tool: ${functionCall.name}`, functionCall.arguments);

    // Execute the tool
    const toolResult = executeTool(functionCall.name, functionCall.arguments);

    if (toolResult) {
      logger.debug('ToolCalling', 'Tool executed, continuing conversation');

      // Add tool result to messages and continue
      const toolResultMessage = formatToolResultForMessages(
        functionCall.name,
        functionCall.arguments,
        toolResult
      );

      // Create updated messages with tool result
      const messagesWithToolResult: CactusMessage[] = [
        ...formattedMessages,
        { role: 'assistant', content: result.response || 'Looking up information...' },
        { role: 'user', content: toolResultMessage },
      ];

      // Second call with knowledge context
      let finalResponse = '';
      const finalResult = await model.complete({
        messages: messagesWithToolResult,
        options: {
          maxTokens: SMALL_MODEL_PARAMS.maxTokens,
        },
        onToken: (token) => {
          finalResponse += token;
          onToken(token);
        },
      });

      // Combine metrics from both calls
      const metrics: PerformanceMetrics = {
        tokensPerSecond: finalResult?.tokensPerSecond || 0,
        timeToFirstTokenMs: result?.timeToFirstTokenMs || 0,
        totalTimeMs: (result?.totalTimeMs || 0) + (finalResult?.totalTimeMs || 0),
        totalTokens: (result?.totalTokens || 0) + (finalResult?.totalTokens || 0),
      };

      return {
        response: finalResult?.response || finalResponse,
        usedTools: true,
        toolTopic: functionCall.arguments?.topic,
        metrics,
      };
    }
  }

  // No tool call, return direct response with metrics
  const metrics: PerformanceMetrics = {
    tokensPerSecond: result?.tokensPerSecond || 0,
    timeToFirstTokenMs: result?.timeToFirstTokenMs || 0,
    totalTimeMs: result?.totalTimeMs || 0,
    totalTokens: result?.totalTokens || 0,
  };

  return {
    response: result?.response || '',
    usedTools: false,
    metrics,
  };
};

// Check if the current model supports tool calling
const currentModelSupportsToolCalling = (): boolean => {
  const { currentModelId } = useModelStore.getState();
  const modelConfig = CACTUS_MODELS[currentModelId];
  return modelConfig?.supportsToolCalling ?? false;
};

// Generate a smart response - uses tool calling for capable models,
// or direct knowledge injection for smaller models
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

  let rawResponse = '';
  let usedTools = false;
  let toolTopic: string | undefined;
  let metrics: PerformanceMetrics | undefined;

  // Check if current model supports tool calling
  const supportsToolCalling = currentModelSupportsToolCalling();
  logger.debug('SmartResponse', `Model supports tool calling: ${supportsToolCalling}`);

  if (supportsToolCalling) {
    // Use tool-calling approach for capable models
    try {
      const toolResult = await generateWithToolCalling(
        messages,
        (token) => {
          rawResponse += token;
          onToken(token);
        },
        context
      );
      rawResponse = toolResult.response || rawResponse;
      usedTools = toolResult.usedTools;
      toolTopic = toolResult.toolTopic;
      metrics = toolResult.metrics;

      logger.debug('SmartResponse', `Tool calling: ${usedTools ? 'Yes' : 'No'}`, toolTopic || 'N/A');
      if (metrics) {
        logger.debug('SmartResponse', `Performance: ${metrics.tokensPerSecond.toFixed(1)} tok/s, ${metrics.totalTokens} tokens`);
      }
    } catch (error) {
      logger.error('SmartResponse', 'Tool-calling generation failed, falling back to knowledge injection', error);
      // Fall through to knowledge injection
      rawResponse = '';
    }
  }

  // For models without tool calling (or if tool calling failed), use direct knowledge injection
  if (!rawResponse) {
    logger.debug('SmartResponse', 'Using direct knowledge injection');
    const knowledgeContext = getRelevantKnowledge(lastUserMessage);

    const fullResponse = await generateStreamingCompletion(
      messages,
      (token) => {
        rawResponse += token;
        onToken(token);
      },
      context
    );
    rawResponse = fullResponse || rawResponse;

    // Mark as knowledge-grounded if we injected knowledge
    if (knowledgeContext) {
      usedTools = true; // Treat knowledge injection as "grounded"
    }
  }

  // Analyze response quality
  const knowledgeContext = getRelevantKnowledge(lastUserMessage);
  const quality = analyzeResponseQuality(rawResponse, knowledgeContext);
  logger.debug('SmartResponse', `Quality score: ${quality.score}`, quality.issues);

  // Get knowledge entry ID if knowledge was used
  const knowledgeEntries = searchKnowledge(lastUserMessage, 1);

  return {
    response: rawResponse,
    source: usedTools ? 'knowledge-grounded' : 'model',
    knowledgeEntryId: knowledgeEntries[0]?.id,
    qualityScore: quality.score,
    usedToolCalling: supportsToolCalling && usedTools,
    metrics,
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

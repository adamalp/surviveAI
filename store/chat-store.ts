import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ChatMessage, Conversation, DeviceContext, ResponseSource } from '@/types';
import { generateSmartResponse, SmartResponse } from '@/lib/cactus';
import { CONFIG } from '@/constants/config';

// Timeout wrapper for model response generation
const withTimeout = <T>(promise: Promise<T>, ms: number, errorMessage: string): Promise<T> => {
  return Promise.race([
    promise,
    new Promise<T>((_, reject) =>
      setTimeout(() => reject(new Error(errorMessage)), ms)
    ),
  ]);
};

const CONVERSATIONS_STORAGE_KEY = 'surviveai_conversations';
const MESSAGES_STORAGE_KEY = 'surviveai_messages';

interface ChatStore {
  // State
  conversations: Conversation[];
  messages: Record<string, ChatMessage[]>; // keyed by conversationId
  activeConversationId: string | null;
  isGenerating: boolean;
  currentResponse: string;
  error: string | null;

  // Computed
  activeConversation: Conversation | null;
  activeMessages: ChatMessage[];

  // Conversation Actions
  createConversation: () => string;
  deleteConversation: (id: string) => Promise<void>;
  setActiveConversation: (id: string | null) => void;
  renameConversation: (id: string, title: string) => Promise<void>;

  // Message Actions
  sendMessage: (content: string, context?: DeviceContext, images?: string[]) => Promise<void>;
  clearConversation: (id: string) => Promise<void>;

  // Persistence
  loadData: () => Promise<void>;
  persistData: () => Promise<void>;
  setError: (error: string | null) => void;
}

// Generate unique ID
const generateId = () => `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

// Generate conversation title from first message
const generateTitle = (content: string): string => {
  const cleaned = content.trim().slice(0, 50);
  return cleaned.length < content.trim().length ? `${cleaned}...` : cleaned;
};

// Clean response by removing thinking tags and other artifacts
const cleanResponse = (text: string | undefined | null): string => {
  if (!text) return '';

  // Remove <think>...</think> blocks (including multiline)
  let cleaned = text.replace(/<think>[\s\S]*?<\/think>/gi, '');

  // Remove any remaining opening think tags (in case response was cut off)
  cleaned = cleaned.replace(/<think>[\s\S]*/gi, '');

  // Remove other common artifacts
  cleaned = cleaned.replace(/<\|.*?\|>/g, ''); // Remove special tokens like <|end|>

  // Remove raw JSON function calls that models might output as text
  cleaned = cleaned.replace(/\{[\s\S]*"function_call"[\s\S]*\}/g, '');
  cleaned = cleaned.replace(/\{[\s\S]*"name"\s*:\s*"lookup_survival_knowledge"[\s\S]*\}/g, '');

  // Trim whitespace
  cleaned = cleaned.trim();

  return cleaned;
};

// Check if we're inside a think block (for streaming)
const isInsideThinkBlock = (text: string | undefined | null): boolean => {
  if (!text) return false;
  const openCount = (text.match(/<think>/gi) || []).length;
  const closeCount = (text.match(/<\/think>/gi) || []).length;
  return openCount > closeCount;
};

export const useChatStore = create<ChatStore>((set, get) => ({
  // Initial state
  conversations: [],
  messages: {},
  activeConversationId: null,
  isGenerating: false,
  currentResponse: '',
  error: null,

  // Computed getters
  get activeConversation() {
    const { conversations, activeConversationId } = get();
    return conversations.find((c) => c.id === activeConversationId) || null;
  },

  get activeMessages() {
    const { messages, activeConversationId } = get();
    return activeConversationId ? messages[activeConversationId] || [] : [];
  },

  // Create a new conversation
  createConversation: () => {
    const id = `conv_${generateId()}`;
    const now = Date.now();

    const newConversation: Conversation = {
      id,
      title: 'New Conversation',
      createdAt: now,
      updatedAt: now,
      messageCount: 0,
      preview: '',
    };

    set((state) => ({
      conversations: [newConversation, ...state.conversations],
      messages: { ...state.messages, [id]: [] },
      activeConversationId: id,
    }));

    // Persist asynchronously
    get().persistData();

    return id;
  },

  // Delete a conversation
  deleteConversation: async (id: string) => {
    set((state) => {
      const newMessages = { ...state.messages };
      delete newMessages[id];

      const newConversations = state.conversations.filter((c) => c.id !== id);
      const newActiveId =
        state.activeConversationId === id
          ? newConversations[0]?.id || null
          : state.activeConversationId;

      return {
        conversations: newConversations,
        messages: newMessages,
        activeConversationId: newActiveId,
      };
    });

    await get().persistData();
  },

  // Set active conversation
  setActiveConversation: (id: string | null) => {
    set({ activeConversationId: id, error: null });
  },

  // Rename a conversation
  renameConversation: async (id: string, title: string) => {
    set((state) => ({
      conversations: state.conversations.map((c) =>
        c.id === id ? { ...c, title } : c
      ),
    }));

    await get().persistData();
  },

  // Send a message in the active conversation
  sendMessage: async (content: string, context?: DeviceContext, images?: string[]) => {
    const { activeConversationId, messages, conversations } = get();

    if (!activeConversationId) {
      set({ error: 'No active conversation' });
      return;
    }

    const conversationMessages = messages[activeConversationId] || [];

    // Create user message
    const userMessage: ChatMessage = {
      id: `msg_${generateId()}`,
      conversationId: activeConversationId,
      role: 'user',
      content,
      timestamp: Date.now(),
      images: images, // Include images if provided
    };

    // Add user message
    const updatedMessages = [...conversationMessages, userMessage];

    // Update title if this is the first message
    const conversation = conversations.find((c) => c.id === activeConversationId);
    const isFirstMessage = conversationMessages.length === 0;

    set((state) => ({
      messages: {
        ...state.messages,
        [activeConversationId]: updatedMessages,
      },
      conversations: state.conversations.map((c) =>
        c.id === activeConversationId
          ? {
              ...c,
              title: isFirstMessage ? generateTitle(content) : c.title,
              updatedAt: Date.now(),
              messageCount: c.messageCount + 1,
              preview: content.slice(0, 100),
            }
          : c
      ),
      isGenerating: true,
      currentResponse: '',
      error: null,
    }));

    let rawResponse = '';

    try {
      // Generate smart response with timeout protection
      const responsePromise = generateSmartResponse(
        updatedMessages.map((m) => ({
          id: m.id,
          conversationId: m.conversationId,
          role: m.role,
          content: m.content,
          timestamp: m.timestamp,
          images: m.images,
        })),
        (token) => {
          rawResponse += token;

          // Only show cleaned, non-thinking content during streaming
          const cleaned = cleanResponse(rawResponse);

          // Only update if we have visible content and not inside think block
          if (cleaned && !isInsideThinkBlock(rawResponse)) {
            set({ currentResponse: cleaned });
          }
        },
        context
      );

      // Wrap with timeout to prevent infinite waits
      const smartResult = await withTimeout(
        responsePromise,
        CONFIG.RESPONSE_TIMEOUT,
        'Response timed out. The model may be overloaded. Please try again.'
      );

      // Use the smart response (may be from cache, model, or fallback)
      const finalResponse = cleanResponse(smartResult.response);

      // Only add message if we have content
      if (finalResponse) {
        const assistantMessage: ChatMessage = {
          id: `msg_${generateId()}`,
          conversationId: activeConversationId,
          role: 'assistant',
          content: finalResponse,
          timestamp: Date.now(),
          source: smartResult.source,
          knowledgeEntryId: smartResult.knowledgeEntryId,
          metrics: smartResult.metrics,
        };

        set((state) => ({
          messages: {
            ...state.messages,
            [activeConversationId]: [
              ...(state.messages[activeConversationId] || []),
              assistantMessage,
            ],
          },
          conversations: state.conversations.map((c) =>
            c.id === activeConversationId
              ? {
                  ...c,
                  updatedAt: Date.now(),
                  messageCount: c.messageCount + 1,
                  preview: finalResponse.slice(0, 100),
                }
              : c
          ),
          isGenerating: false,
          currentResponse: '',
        }));

        // Persist to storage
        await get().persistData();
      } else {
        // No useful response
        set({
          isGenerating: false,
          currentResponse: '',
          error: 'No response generated. Please try again.',
        });
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to generate response';
      set({ isGenerating: false, error: message, currentResponse: '' });
    }
  },

  // Clear a specific conversation's messages
  clearConversation: async (id: string) => {
    set((state) => ({
      messages: { ...state.messages, [id]: [] },
      conversations: state.conversations.map((c) =>
        c.id === id
          ? { ...c, messageCount: 0, preview: '', updatedAt: Date.now() }
          : c
      ),
    }));

    await get().persistData();
  },

  // Load data from storage
  loadData: async () => {
    try {
      const [conversationsJson, messagesJson] = await Promise.all([
        AsyncStorage.getItem(CONVERSATIONS_STORAGE_KEY),
        AsyncStorage.getItem(MESSAGES_STORAGE_KEY),
      ]);

      const conversations = conversationsJson
        ? (JSON.parse(conversationsJson) as Conversation[])
        : [];
      const messages = messagesJson
        ? (JSON.parse(messagesJson) as Record<string, ChatMessage[]>)
        : {};

      set({
        conversations,
        messages,
        activeConversationId: conversations[0]?.id || null,
      });
    } catch (error) {
      console.error('Failed to load chat data:', error);
    }
  },

  // Persist data to storage
  persistData: async () => {
    const { conversations, messages } = get();
    try {
      await Promise.all([
        AsyncStorage.setItem(CONVERSATIONS_STORAGE_KEY, JSON.stringify(conversations)),
        AsyncStorage.setItem(MESSAGES_STORAGE_KEY, JSON.stringify(messages)),
      ]);
    } catch (error) {
      console.error('Failed to persist chat data:', error);
    }
  },

  // Set error state
  setError: (error) => set({ error }),
}));

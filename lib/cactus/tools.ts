import type { Tool } from 'cactus-react-native';
import { executeKnowledgeTool, TopicId } from '@/lib/knowledge';

// Survival knowledge lookup tool for Cactus SDK
export const SURVIVAL_TOOLS: Tool[] = [
  {
    name: 'lookup_survival_knowledge',
    description: 'Look up specific survival knowledge from the database. Use this when you need accurate information about first aid, water purification, shelter building, navigation, fire starting, signaling for rescue, food foraging, or survival psychology.',
    parameters: {
      type: 'object',
      properties: {
        topic: {
          type: 'string',
          description: 'The survival topic: first-aid, water, shelter, navigation, fire, signaling, food, or psychology',
        },
        query: {
          type: 'string',
          description: 'Specific question or keyword to search for within the topic',
        },
      },
      required: ['topic'],
    },
  },
];

// Valid topic IDs for validation
const VALID_TOPICS = [
  'first-aid', 'water', 'shelter', 'navigation',
  'fire', 'signaling', 'food', 'psychology'
];

// Execute a tool call and return the result
export const executeTool = (
  name: string,
  args: { [key: string]: any }
): string | null => {
  if (name === 'lookup_survival_knowledge') {
    const topic = args.topic as string;
    const query = args.query as string | undefined;

    // Validate topic
    if (!topic || !VALID_TOPICS.includes(topic)) {
      return `Invalid topic "${topic}". Valid topics: ${VALID_TOPICS.join(', ')}`;
    }

    return executeKnowledgeTool({ topic: topic as TopicId, query });
  }

  return null; // Unknown tool
};

// Format tool results for injection into conversation
export const formatToolResultForMessages = (
  toolName: string,
  toolArgs: { [key: string]: any },
  result: string
): string => {
  return `[Knowledge Retrieved for "${toolArgs.topic}"${toolArgs.query ? ` (query: ${toolArgs.query})` : ''}]\n${result}`;
};

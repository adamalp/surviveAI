import { KnowledgeTopic, KnowledgeEntry, TopicId } from './types';
import { firstAidKnowledge } from './first-aid';
import { waterKnowledge } from './water';
import { shelterKnowledge } from './shelter';
import { navigationKnowledge } from './navigation';
import { fireKnowledge } from './fire';
import { signalingKnowledge } from './signaling';
import { foodKnowledge } from './food';

// Export all knowledge topics
export const KNOWLEDGE_TOPICS: Record<TopicId, KnowledgeTopic> = {
  'first-aid': firstAidKnowledge,
  'water': waterKnowledge,
  'shelter': shelterKnowledge,
  'navigation': navigationKnowledge,
  'fire': fireKnowledge,
  'signaling': signalingKnowledge,
  'food': foodKnowledge,
  // Aliases
  'weather': shelterKnowledge, // Weather relates to shelter
  'animals': foodKnowledge, // Animals relates to food
};

// All topics as array
export const ALL_TOPICS = Object.values(KNOWLEDGE_TOPICS);

// Get all entries across all topics
export const getAllEntries = (): KnowledgeEntry[] => {
  const entries: KnowledgeEntry[] = [];
  const seen = new Set<string>();

  for (const topic of ALL_TOPICS) {
    for (const entry of topic.entries) {
      if (!seen.has(entry.id)) {
        seen.add(entry.id);
        entries.push(entry);
      }
    }
  }
  return entries;
};

// Search for relevant knowledge based on query
export const searchKnowledge = (query: string, maxResults: number = 3): KnowledgeEntry[] => {
  const queryLower = query.toLowerCase();
  const words = queryLower.split(/\s+/).filter(w => w.length > 2);

  const scored: { entry: KnowledgeEntry; score: number }[] = [];

  for (const entry of getAllEntries()) {
    let score = 0;

    // Check title match
    if (entry.title.toLowerCase().includes(queryLower)) {
      score += 10;
    }

    // Check keyword matches
    for (const keyword of entry.keywords) {
      if (queryLower.includes(keyword)) {
        score += 5;
      }
      for (const word of words) {
        if (keyword.includes(word) || word.includes(keyword)) {
          score += 2;
        }
      }
    }

    // Check content matches
    const contentLower = entry.content.toLowerCase();
    for (const word of words) {
      if (contentLower.includes(word)) {
        score += 1;
      }
    }

    // Boost critical priority
    if (entry.priority === 'critical') score *= 1.5;
    else if (entry.priority === 'high') score *= 1.2;

    if (score > 0) {
      scored.push({ entry, score });
    }
  }

  // Sort by score descending
  scored.sort((a, b) => b.score - a.score);

  return scored.slice(0, maxResults).map(s => s.entry);
};

// Get topic by ID
export const getTopic = (topicId: TopicId): KnowledgeTopic | undefined => {
  return KNOWLEDGE_TOPICS[topicId];
};

// Get specific entry by ID
export const getEntry = (entryId: string): KnowledgeEntry | undefined => {
  for (const entry of getAllEntries()) {
    if (entry.id === entryId) {
      return entry;
    }
  }
  return undefined;
};

// Detect topic from message
export const detectTopics = (message: string): TopicId[] => {
  const messageLower = message.toLowerCase();
  const detected: { topic: TopicId; score: number }[] = [];

  for (const [topicId, topic] of Object.entries(KNOWLEDGE_TOPICS)) {
    let score = 0;

    for (const keyword of topic.keywords) {
      if (messageLower.includes(keyword)) {
        score += 1;
      }
    }

    if (score > 0) {
      detected.push({ topic: topicId as TopicId, score });
    }
  }

  detected.sort((a, b) => b.score - a.score);
  return detected.slice(0, 2).map(d => d.topic);
};

// Format knowledge for injection into prompt
export const formatKnowledgeForPrompt = (entries: KnowledgeEntry[]): string => {
  if (entries.length === 0) return '';

  const formatted = entries.map(entry =>
    `### ${entry.title}\n${entry.content}`
  ).join('\n\n');

  return `\n---\nRELEVANT SURVIVAL KNOWLEDGE:\n${formatted}\n---\n`;
};

// Main function to get relevant knowledge for a query
export const getRelevantKnowledge = (query: string): string => {
  const entries = searchKnowledge(query, 3);
  return formatKnowledgeForPrompt(entries);
};

// Tool definition for Cactus SDK
export const KNOWLEDGE_TOOL = {
  name: 'lookup_survival_knowledge',
  description: 'Look up specific survival knowledge from the database. Use this when you need accurate information about first aid, water purification, shelter building, navigation, fire starting, signaling for rescue, or food foraging.',
  parameters: {
    type: 'object',
    properties: {
      topic: {
        type: 'string',
        enum: ['first-aid', 'water', 'shelter', 'navigation', 'fire', 'signaling', 'food'],
        description: 'The survival topic to look up',
      },
      query: {
        type: 'string',
        description: 'Specific question or keyword to search for within the topic',
      },
    },
    required: ['topic'],
  },
};

// Execute the knowledge tool
export const executeKnowledgeTool = (args: { topic: TopicId; query?: string }): string => {
  const topic = getTopic(args.topic);

  if (!topic) {
    return `Topic "${args.topic}" not found.`;
  }

  if (args.query) {
    // Search within topic
    const entries = searchKnowledge(args.query, 2);
    const topicEntries = entries.filter(e =>
      topic.entries.some(te => te.id === e.id)
    );

    if (topicEntries.length > 0) {
      return formatKnowledgeForPrompt(topicEntries);
    }
  }

  // Return top entries from topic
  const topEntries = topic.entries
    .filter(e => e.priority === 'critical' || e.priority === 'high')
    .slice(0, 2);

  return formatKnowledgeForPrompt(topEntries);
};

// Export types
export * from './types';

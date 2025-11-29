// Knowledge base types

export interface KnowledgeEntry {
  id: string;
  title: string;
  content: string;
  keywords: string[];
  priority: 'critical' | 'high' | 'medium' | 'low';
}

export interface KnowledgeTopic {
  id: string;
  name: string;
  description: string;
  keywords: string[];
  entries: KnowledgeEntry[];
}

export type TopicId =
  | 'first-aid'
  | 'water'
  | 'shelter'
  | 'navigation'
  | 'signaling'
  | 'food'
  | 'fire'
  | 'weather'
  | 'animals';

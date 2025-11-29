// Cache matching system for finding pre-computed answers
// Uses keyword matching with scoring to find the best match

import { CachedQA, CACHED_QA } from './cached-qa';

interface MatchResult {
  qa: CachedQA;
  score: number;
  matchedKeywords: string[];
}

// Common words to ignore in matching
const STOP_WORDS = new Set([
  'the', 'a', 'an', 'is', 'are', 'was', 'were', 'be', 'been', 'being',
  'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'could',
  'should', 'may', 'might', 'must', 'shall', 'can', 'to', 'of', 'in',
  'for', 'on', 'with', 'at', 'by', 'from', 'or', 'and', 'not', 'if',
  'but', 'as', 'it', 'this', 'that', 'which', 'who', 'whom', 'what',
  'your', 'you', 'i', 'me', 'my', 'we', 'our', 'they', 'their', 'them',
  'how', 'when', 'where', 'why', 'what',
]);

// Minimum score threshold for a match to be considered valid
const MIN_SCORE_THRESHOLD = 15;

// High confidence threshold (definitely use cached answer)
const HIGH_CONFIDENCE_THRESHOLD = 40;

// Extract meaningful words from query
const extractQueryWords = (query: string): string[] => {
  return query
    .toLowerCase()
    .replace(/[^a-z\s]/g, ' ')
    .split(/\s+/)
    .filter(word => word.length > 2 && !STOP_WORDS.has(word));
};

// Calculate similarity between two words (handles partial matches)
const wordSimilarity = (word1: string, word2: string): number => {
  if (word1 === word2) return 1;
  if (word1.includes(word2) || word2.includes(word1)) return 0.7;
  return 0;
};

// Score a single cached QA against a query
const scoreMatch = (qa: CachedQA, query: string, queryWords: string[]): MatchResult => {
  let score = 0;
  const matchedKeywords: string[] = [];
  const queryLower = query.toLowerCase();

  // Exact question match (highest score)
  if (queryLower.includes(qa.question.toLowerCase().slice(0, 20))) {
    score += 50;
    matchedKeywords.push('question-match');
  }

  // Keyword matching
  for (const keyword of qa.keywords) {
    // Direct keyword match in query
    if (queryLower.includes(keyword)) {
      score += 10;
      matchedKeywords.push(keyword);
      continue;
    }

    // Word-by-word matching
    for (const word of queryWords) {
      const similarity = wordSimilarity(word, keyword);
      if (similarity > 0) {
        score += Math.round(similarity * 5);
        if (similarity >= 0.7 && !matchedKeywords.includes(keyword)) {
          matchedKeywords.push(keyword);
        }
      }
    }
  }

  // Bonus for multiple keyword matches (indicates stronger relevance)
  if (matchedKeywords.length >= 3) {
    score += 10;
  }
  if (matchedKeywords.length >= 5) {
    score += 10;
  }

  return { qa, score, matchedKeywords };
};

// Find the best matching cached answer for a query
export const findCachedAnswer = (query: string): CachedQA | null => {
  if (!query || query.trim().length < 5) {
    return null;
  }

  const queryWords = extractQueryWords(query);

  if (queryWords.length === 0) {
    return null;
  }

  let bestMatch: MatchResult | null = null;

  for (const qa of CACHED_QA) {
    const result = scoreMatch(qa, query, queryWords);

    if (result.score >= MIN_SCORE_THRESHOLD) {
      if (!bestMatch || result.score > bestMatch.score) {
        bestMatch = result;
      }
    }
  }

  return bestMatch?.qa || null;
};

// Find cached answer with match details
export const findCachedAnswerWithDetails = (query: string): MatchResult | null => {
  if (!query || query.trim().length < 5) {
    return null;
  }

  const queryWords = extractQueryWords(query);

  if (queryWords.length === 0) {
    return null;
  }

  let bestMatch: MatchResult | null = null;

  for (const qa of CACHED_QA) {
    const result = scoreMatch(qa, query, queryWords);

    if (result.score >= MIN_SCORE_THRESHOLD) {
      if (!bestMatch || result.score > bestMatch.score) {
        bestMatch = result;
      }
    }
  }

  return bestMatch;
};

// Check if match is high confidence (should definitely use cached answer)
export const isHighConfidenceMatch = (query: string): boolean => {
  const result = findCachedAnswerWithDetails(query);
  return result !== null && result.score >= HIGH_CONFIDENCE_THRESHOLD;
};

// Get multiple potential matches (for debugging or UI suggestions)
export const findTopMatches = (query: string, limit: number = 3): MatchResult[] => {
  if (!query || query.trim().length < 5) {
    return [];
  }

  const queryWords = extractQueryWords(query);

  if (queryWords.length === 0) {
    return [];
  }

  const results: MatchResult[] = [];

  for (const qa of CACHED_QA) {
    const result = scoreMatch(qa, query, queryWords);
    if (result.score >= MIN_SCORE_THRESHOLD) {
      results.push(result);
    }
  }

  // Sort by score descending
  results.sort((a, b) => b.score - a.score);

  return results.slice(0, limit);
};

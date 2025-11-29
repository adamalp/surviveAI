// Response quality analysis for detecting low-confidence or problematic responses
// Used to determine when to fall back to raw knowledge entries

export interface QualityAnalysis {
  isLowConfidence: boolean;
  hasUncertainty: boolean;
  isTooShort: boolean;
  isTooLong: boolean;
  hasRepetition: boolean;
  score: number; // 0-100
  issues: string[];
}

// Patterns that indicate uncertainty or lack of confidence
const UNCERTAINTY_PATTERNS = [
  /i('m| am) not (sure|certain)/i,
  /i don't know/i,
  /i cannot (determine|say|tell)/i,
  /i'm unsure/i,
  /it's (hard|difficult) to (say|tell|know)/i,
  /i'm not able to/i,
  /unclear/i,
  /i have no (information|knowledge)/i,
  /cannot provide/i,
  /beyond my (knowledge|ability)/i,
];

// Patterns that indicate the model is confused or off-topic
const CONFUSION_PATTERNS = [
  /as an ai/i,
  /as a language model/i,
  /i apologize/i,
  /i'm sorry,? but/i,
  /i cannot assist with/i,
  /please consult a (doctor|professional|expert)/i, // Without actionable advice
];

// Detect repetitive content (same phrase appearing multiple times)
const detectRepetition = (text: string): boolean => {
  const sentences = text.split(/[.!?]+/).map(s => s.trim().toLowerCase()).filter(s => s.length > 20);
  const seen = new Set<string>();

  for (const sentence of sentences) {
    if (seen.has(sentence)) {
      return true;
    }
    seen.add(sentence);
  }

  // Check for repeated phrases (3+ word sequences appearing 3+ times)
  const words = text.toLowerCase().split(/\s+/);
  const phrases = new Map<string, number>();

  for (let i = 0; i < words.length - 2; i++) {
    const phrase = `${words[i]} ${words[i + 1]} ${words[i + 2]}`;
    phrases.set(phrase, (phrases.get(phrase) || 0) + 1);
  }

  for (const count of phrases.values()) {
    if (count >= 3) {
      return true;
    }
  }

  return false;
};

// Check if the response seems off-topic or confused
const detectConfusion = (response: string): boolean => {
  return CONFUSION_PATTERNS.some(pattern => pattern.test(response));
};

// Analyze response quality
export const analyzeResponseQuality = (
  response: string,
  injectedKnowledge?: string
): QualityAnalysis => {
  const issues: string[] = [];
  let score = 100;

  // Check for uncertainty patterns
  const hasUncertainty = UNCERTAINTY_PATTERNS.some(p => p.test(response));
  if (hasUncertainty) {
    score -= 25;
    issues.push('Response expresses uncertainty');
  }

  // Check for confusion patterns
  const isConfused = detectConfusion(response);
  if (isConfused) {
    score -= 20;
    issues.push('Response seems off-topic or confused');
  }

  // Length checks
  const isTooShort = response.length < 50;
  if (isTooShort) {
    score -= 30;
    issues.push('Response is too short to be helpful');
  }

  const isTooLong = response.length > 2500;
  if (isTooLong) {
    score -= 10;
    issues.push('Response is excessively long');
  }

  // Repetition check
  const hasRepetition = detectRepetition(response);
  if (hasRepetition) {
    score -= 25;
    issues.push('Response contains repetitive content');
  }

  // If we have knowledge but response doesn't reference key terms, might be ignoring it
  if (injectedKnowledge && injectedKnowledge.length > 0) {
    const knowledgeTerms = extractKeyTerms(injectedKnowledge);
    const responseTerms = extractKeyTerms(response);
    const overlap = knowledgeTerms.filter(term => responseTerms.includes(term));

    // If less than 20% overlap, model might be ignoring the knowledge
    if (knowledgeTerms.length > 0 && overlap.length / knowledgeTerms.length < 0.2) {
      score -= 15;
      issues.push('Response may not be using provided knowledge');
    }
  }

  // Ensure score doesn't go below 0
  score = Math.max(0, score);

  return {
    isLowConfidence: score < 60,
    hasUncertainty,
    isTooShort,
    isTooLong,
    hasRepetition,
    score,
    issues,
  };
};

// Extract key terms from text for comparison
const extractKeyTerms = (text: string): string[] => {
  const stopWords = new Set([
    'the', 'a', 'an', 'is', 'are', 'was', 'were', 'be', 'been', 'being',
    'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'could',
    'should', 'may', 'might', 'must', 'shall', 'can', 'to', 'of', 'in',
    'for', 'on', 'with', 'at', 'by', 'from', 'or', 'and', 'not', 'if',
    'but', 'as', 'it', 'this', 'that', 'which', 'who', 'whom', 'what',
    'your', 'you', 'i', 'me', 'my', 'we', 'our', 'they', 'their', 'them',
  ]);

  return text
    .toLowerCase()
    .replace(/[^a-z\s]/g, ' ')
    .split(/\s+/)
    .filter(word => word.length > 3 && !stopWords.has(word));
};

// Quick check if response is definitely low quality
export const isDefinitelyLowQuality = (response: string): boolean => {
  // Empty or near-empty
  if (!response || response.trim().length < 20) {
    return true;
  }

  // Just an apology or refusal
  if (/^(i'm sorry|i apologize|i cannot|i'm not able)/i.test(response.trim())) {
    return true;
  }

  // Just repeating the question
  if (response.split(/\s+/).length < 10) {
    return true;
  }

  return false;
};

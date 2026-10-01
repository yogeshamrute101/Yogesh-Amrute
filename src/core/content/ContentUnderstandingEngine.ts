import {
  ContentClassification,
  ContentInput,
  ContentUnderstandingResult,
  ContentCategory,
} from './ContentTypes';

function combinedText(input: ContentInput): string {
  return [
    input.text ?? '',
    input.transcript ?? '',
  ]
    .join(' ')
    .trim();
}

function detectCategories(text: string): ContentCategory[] {
  const value = text.toLowerCase();
  const categories = new Set<ContentCategory>();

  if (
    /\b(kids?|children|child|cartoon|nursery|abc|toys?|toys|school kids)\b/.test(
      value
    )
  ) {
    categories.add('for-kids');
  }

  if (
    /\b(family|parents?|mother|father|family friendly)\b/.test(
      value
    )
  ) {
    categories.add('for-family');
  }

  if (
    /\b(learn|learning|education|educational|tutorial|lesson|course|study|how to)\b/.test(
      value
    )
  ) {
    categories.add('educational');
  }

  if (
    /\b(movie|film|music|song|comedy|funny|entertainment|show|dance)\b/.test(
      value
    )
  ) {
    categories.add('entertainment');
  }

  if (
    /\b(business|finance|corporate|work|career|marketing|startup|professional)\b/.test(
      value
    )
  ) {
    categories.add('professional');
  }

  if (
    /\b(news|report|information|guide|facts|announcement|update)\b/.test(
      value
    )
  ) {
    categories.add('informational');
  }

  if (
    /\b(art|design|creative|story|writing|animation|photography)\b/.test(
      value
    )
  ) {
    categories.add('creative');
  }

  if (
    /\b(science|physics|chemistry|biology|engineering|space|technology|technical)\b/.test(
      value
    )
  ) {
    categories.add('science-technical');
  }

  if (
    /\b(medicine|medical|pharma|drug|disease|hospital|doctor|clinical|protein|gene)\b/.test(
      value
    )
  ) {
    categories.add('medical-pharma');
  }

  if (
    /\b(game|gaming|gamer|esports|minecraft|roblox)\b/.test(
      value
    )
  ) {
    categories.add('gaming');
  }

  if (categories.size === 0) {
    categories.add('general');
  }

  return [...categories];
}

function detectRisk(text: string): {
  level: 'low' | 'moderate' | 'high' | 'unknown';
  flags: string[];
} {
  const value = text.toLowerCase();
  const flags: string[] = [];

  if (/\b(violence|violent|blood|graphic|gore)\b/.test(value)) {
    flags.push('potentially-violent-content');
  }

  if (
    /\b(explicit|sexual|porn|nudity|adult-only)\b/.test(value)
  ) {
    flags.push('adult-content-indicator');
  }

  if (
    /\b(self harm|suicide|kill myself|dangerous challenge)\b/.test(
      value
    )
  ) {
    flags.push('high-risk-topic');
  }

  if (flags.includes('high-risk-topic')) {
    return { level: 'high', flags };
  }

  if (flags.length > 0) {
    return { level: 'moderate', flags };
  }

  return { level: 'low', flags };
}

export function understandContent(
  input: ContentInput
): ContentUnderstandingResult {
  const text = combinedText(input);
  const categories = detectCategories(text);
  const risk = detectRisk(text);

  const primaryCategory = categories[0] ?? 'general';

  const classification: ContentClassification = {
    primaryCategory,
    secondaryCategories: categories.slice(1),
    confidence: text.length > 40 ? 0.82 : 0.55,
    topics: categories,
    audience: {
      kids: categories.includes('for-kids'),
      family: categories.includes('for-family'),
      general: true,
      professional: categories.includes('professional'),
    },
    risk,
    explanation:
      `Content classified primarily as "${primaryCategory}" ` +
      `based on detected language/topics.`,
  };

  return {
    success: true,
    inputType: input.type,
    classification,
    extractedText: text,
    detectedTopics: categories,
  };
}

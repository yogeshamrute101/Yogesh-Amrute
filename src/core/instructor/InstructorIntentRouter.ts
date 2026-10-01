import {
  InstructorDomain,
  InstructorMode,
  InstructorRequest,
} from './UniversalInstructorTypes';

const rules: Array<{
  domain: InstructorDomain;
  words: string[];
}> = [
  { domain: 'ai', words: ['ai', 'artificial intelligence', 'machine learning', 'llm', 'agent'] },
  { domain: 'software', words: ['software', 'app', 'programming', 'developer', 'api'] },
  { domain: 'coding', words: ['code', 'coding', 'python', 'javascript', 'typescript', 'react'] },
  { domain: 'science', words: ['science', 'research', 'discovery', 'experiment'] },
  { domain: 'space', words: ['space', 'nasa', 'rocket', 'satellite', 'astronomy'] },
  { domain: 'engineering', words: ['engineering', 'robot', 'robotics', 'mechanical'] },
  { domain: 'pharma', words: ['drug', 'pharma', 'pharmaceutical', 'medicine', 'clinical'] },
  { domain: 'biology', words: ['biology', 'gene', 'protein', 'enzyme', 'cell'] },
  { domain: 'business', words: ['business', 'company', 'industry', 'startup'] },
  { domain: 'economics', words: ['economy', 'economic', 'market', 'inflation'] },
  { domain: 'energy', words: ['energy', 'solar', 'battery', 'nuclear', 'power grid'] },
  { domain: 'environment', words: ['climate', 'environment', 'pollution', 'emissions'] },
  { domain: 'language', words: ['english', 'marathi', 'hindi', 'grammar', 'language'] },
  { domain: 'mathematics', words: ['math', 'mathematics', 'algebra', 'calculus'] },
  { domain: 'physics', words: ['physics', 'quantum', 'relativity'] },
  { domain: 'chemistry', words: ['chemistry', 'chemical', 'molecule'] },
];

export class InstructorIntentRouter {
  route(request: InstructorRequest): {
    domain: InstructorDomain;
    mode: InstructorMode;
    topic: string;
    requiresOnlineResearch: boolean;
    requiresInterview: boolean;
  } {
    const text = `${request.message} ${request.topic ?? ''}`.toLowerCase();

    const mode =
      request.mode ??
      (/(interview|interview me|questions|ask me|test me|exam)/i.test(text)
        ? 'interview'
        : /(latest|today|current|recent|news|what happened|developments)/i.test(text)
          ? 'news'
          : /(research|deep dive|paper|study|evidence)/i.test(text)
            ? 'research'
            : /(compare|difference|versus|vs)/i.test(text)
              ? 'compare'
              : 'teach');

    const domain =
      request.domain ??
      rules.find((rule) => rule.words.some((word) => text.includes(word)))
        ?.domain ??
      (mode === 'news' ? 'news' : 'general');

    const topic =
      request.topic?.trim() ||
      text
        .replace(
          /\b(please|tell me|teach me|explain|latest|today|current|news|interview me|ask me|about)\b/gi,
          ' ',
        )
        .replace(/\s+/g, ' ')
        .trim() ||
      'general knowledge';

    return {
      domain,
      mode,
      topic,
      requiresOnlineResearch: mode === 'news' || mode === 'research',
      requiresInterview: mode === 'interview',
    };
  }
}

import type {
  KnowledgeAnswer,
  KnowledgeQuery,
  KnowledgeSource,
} from '../../types/knowledge/UniversalKnowledge';

export interface KnowledgeProvider {
  id: string;
  search(
    query: KnowledgeQuery,
  ): Promise<{
    answer?: string;
    sources: KnowledgeSource[];
  }>;
}

const providers: KnowledgeProvider[] = [];

export function registerKnowledgeProvider(
  provider: KnowledgeProvider,
) {
  providers.push(provider);
}

export function getKnowledgeProviders() {
  return [...providers];
}

export async function retrieveKnowledge(
  query: KnowledgeQuery,
): Promise<KnowledgeAnswer> {
  if (!query.question.trim()) {
    return {
      answer: '',
      sources: [],
      confidence: 'low',
      limitations: ['A question is required.'],
      relatedTopics: [],
    };
  }

  if (!providers.length) {
    return {
      answer:
        'No knowledge provider is currently configured. Configure a supported source/provider before claiming external knowledge retrieval.',
      sources: [],
      confidence: 'low',
      limitations: [
        'External knowledge retrieval is not configured.',
      ],
      relatedTopics: [],
    };
  }

  const results = await Promise.all(
    providers.map(async (provider) => {
      try {
        return await provider.search(query);
      } catch {
        return {
          sources: [],
        };
      }
    }),
  );

  const sources = results.flatMap((result) => result.sources);
  const answers = results
    .map((result) => result.answer)
    .filter(Boolean);

  return {
    answer:
      answers[0] ??
      'Sources were retrieved, but no synthesized answer was returned.',
    sources,
    confidence: sources.length ? 'medium' : 'low',
    limitations: [
      'Knowledge depends on the configured sources.',
      'Conflicting sources must be identified rather than silently merged.',
    ],
    relatedTopics: [],
  };
}

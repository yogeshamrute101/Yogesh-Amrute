import {
  universalKnowledgeEngine,
} from '../../core/knowledge/UniversalKnowledgeEngine';

export async function routeKnowledgeRequest(input: {
  mode: 'ask' | 'teach' | 'compare';
  question?: string;
  subject?: string;
  topics?: string[];
  language?: string;
}) {
  if (input.mode === 'teach' && input.subject) {
    return universalKnowledgeEngine.teach(
      input.subject,
      input.language,
    );
  }

  if (
    input.mode === 'compare' &&
    input.question &&
    input.topics?.length
  ) {
    return universalKnowledgeEngine.compare(
      input.question,
      input.topics,
    );
  }

  return universalKnowledgeEngine.ask({
    question: input.question ?? input.subject ?? '',
    language: input.language,
    depth: 'deep',
  });
}

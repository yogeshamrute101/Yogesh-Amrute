import {
  retrieveKnowledge,
} from '../../services/knowledge/KnowledgeRetriever';
import type {
  KnowledgeQuery,
} from '../../types/knowledge/UniversalKnowledge';

export class UniversalKnowledgeEngine {
  async ask(query: KnowledgeQuery) {
    return retrieveKnowledge(query);
  }

  async compare(
    question: string,
    topics: string[],
  ) {
    const results = await Promise.all(
      topics.map((topic) =>
        retrieveKnowledge({
          question: `${question} Explain specifically in relation to ${topic}.`,
          depth: 'deep',
        }),
      ),
    );

    return {
      question,
      topics,
      results,
    };
  }

  async teach(
    subject: string,
    language = 'auto',
  ) {
    return retrieveKnowledge({
      question:
        `Teach ${subject} from beginner to advanced level. ` +
        `Synthesize relevant books and reliable sources, identify disagreements, ` +
        `and clearly separate established facts from interpretation.`,
      subject,
      language,
      depth: 'deep',
    });
  }
}

export const universalKnowledgeEngine =
  new UniversalKnowledgeEngine();

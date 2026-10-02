import { prepareDocumentary } from '../../services/documentary/DocumentaryPipeline';

export class DocumentaryEngine {
  create(input: {
    prompt: string;
    topic:
      | 'science'
      | 'space'
      | 'wildlife'
      | 'nature'
      | 'history'
      | 'technology'
      | 'engineering'
      | 'pharma'
      | 'energy'
      | 'environment'
      | 'business'
      | 'general';
    title?: string;
    durationSeconds?: number;
  }) {
    return prepareDocumentary(input);
  }
}

export const documentaryEngine = new DocumentaryEngine();

export type KnowledgeSourceType =
  | 'book'
  | 'paper'
  | 'article'
  | 'documentation'
  | 'dataset'
  | 'web'
  | 'user_document'
  | 'generated';

export interface KnowledgeSource {
  id: string;
  title: string;
  author?: string;
  sourceType: KnowledgeSourceType;
  url?: string;
  publicationYear?: number;
  language?: string;
  topics: string[];
  rightsStatus?: 'public_domain' | 'licensed' | 'user_provided' | 'unknown';
}

export interface KnowledgeChunk {
  id: string;
  sourceId: string;
  text: string;
  topics: string[];
  embedding?: number[];
  metadata: Record<string, string>;
}

export interface KnowledgeAnswer {
  answer: string;
  sources: KnowledgeSource[];
  confidence: 'high' | 'medium' | 'low';
  limitations: string[];
  relatedTopics: string[];
}

export interface KnowledgeQuery {
  question: string;
  subject?: string;
  language?: string;
  depth?: 'quick' | 'standard' | 'deep';
}

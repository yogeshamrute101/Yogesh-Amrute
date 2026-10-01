export type ContentInputType =
  | 'video'
  | 'image'
  | 'text'
  | 'mixed';

export type ContentCategory =
  | 'for-kids'
  | 'for-family'
  | 'educational'
  | 'entertainment'
  | 'professional'
  | 'informational'
  | 'creative'
  | 'science-technical'
  | 'medical-pharma'
  | 'gaming'
  | 'news-current-events'
  | 'general'
  | 'needs-review';

export type ContentRiskLevel =
  | 'low'
  | 'moderate'
  | 'high'
  | 'unknown';

export interface ContentClassification {
  primaryCategory: ContentCategory;
  secondaryCategories: ContentCategory[];
  confidence: number;
  topics: string[];
  audience: {
    kids: boolean;
    family: boolean;
    general: boolean;
    professional: boolean;
  };
  risk: {
    level: ContentRiskLevel;
    flags: string[];
  };
  explanation: string;
}

export interface ContentInput {
  type: ContentInputType;
  text?: string;
  transcript?: string;
  metadata?: Record<string, unknown>;
  mediaReference?: string;
}

export interface ContentUnderstandingResult {
  success: boolean;
  inputType: ContentInputType;
  classification: ContentClassification;
  extractedText: string;
  detectedTopics: string[];
}

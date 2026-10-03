export type ReferenceSourceType =
  | "youtube"
  | "news"
  | "web"
  | "document"
  | "unknown";

export interface ReferenceSource {
  url: string;
  type: ReferenceSourceType;
  title?: string;
  description?: string;
  language?: string;
  durationSeconds?: number;
  transcriptAvailable: boolean;
  metadataAvailable: boolean;
}

export interface ReferenceContent {
  source: ReferenceSource;
  title: string;
  summary: string;
  topics: string[];
  factualClaims: string[];
  uncertainties: string[];
  transcript?: string;
}

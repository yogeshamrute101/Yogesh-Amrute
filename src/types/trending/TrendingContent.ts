export interface TrendingTopic {
  id: string;
  title: string;
  sourceUrl?: string;
  sourceName?: string;
  publishedAt?: string;
  region?: string;
  category?: string;
}

export interface GeneratedTrendingVideoRequest {
  topic: TrendingTopic;
  originalScriptRequired: true;
  sourceFootageReuseAllowed: false;
}

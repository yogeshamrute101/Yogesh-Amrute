export type ReferenceType =
  | 'tv_show'
  | 'live_show'
  | 'play'
  | 'documentary'
  | 'news_program'
  | 'interview'
  | 'lecture'
  | 'web_show'
  | 'unknown';

export interface ReferenceAnalysis {
  sourceUrl: string;
  type: ReferenceType;
  title?: string;
  format: string;
  segmentStructure: string[];
  presentationStyle: string;
  cameraLanguage: string[];
  staging: string;
  pacing: string;
  audienceInteraction: string;
  audioStructure: string;
  visualPatterns: string[];
  productionElements: string[];
  originalityRequirements: string[];
}

export interface LiveShowPlan {
  id: string;
  title: string;
  sourceReference: string;
  format: string;
  host: {
    role: string;
    presentationStyle: string;
    voiceDirection: string;
    appearanceDirection: string;
  };
  set: {
    environment: string;
    background: string;
    lighting: string;
    props: string[];
  };
  segments: Array<{
    id: string;
    title: string;
    durationSeconds: number;
    purpose: string;
    visualDirection: string;
    hostDirection: string;
    cameraDirection: string;
    audienceDirection?: string;
  }>;
  graphics: string[];
  audio: string[];
  safety: {
    originalProduction: boolean;
    noExactCopyrightedFootage: boolean;
    noUnauthorizedVoiceClone: boolean;
    noUnauthorizedLikenessClone: boolean;
  };
}

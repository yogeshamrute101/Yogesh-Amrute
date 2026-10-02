export type DocumentaryTopic =
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

export type DocumentarySegment =
  | 'cold_open'
  | 'narration'
  | 'host_intro'
  | 'cinematic_broll'
  | 'explainer'
  | 'diagram'
  | 'map'
  | 'data_visualization'
  | 'interview'
  | 'timeline'
  | 'reconstruction'
  | 'comparison'
  | 'chapter_transition'
  | 'conclusion';

export interface DocumentaryScene {
  id: string;
  segment: DocumentarySegment;
  topic: DocumentaryTopic;
  durationSeconds: number;
  location: string;
  background: string;
  visualPrompt: string;
  narration: string;
  hostDirection?: string;
  cameraDirection: string;
  soundDirection: string;
  graphicsDirection?: string;
  factualNotes: string[];
}

export interface DocumentaryPlan {
  id: string;
  title: string;
  topic: DocumentaryTopic;
  hook: string;
  synopsis: string;
  visualStyle: string;
  narratorStyle: string;
  musicStyle: string;
  scenes: DocumentaryScene[];
}

export type CinematicSubject =
  | 'news'
  | 'education'
  | 'documentary'
  | 'business'
  | 'science'
  | 'pharma'
  | 'history'
  | 'entertainment'
  | 'general';

export type PerformanceRole =
  | 'anchor'
  | 'teacher'
  | 'reporter'
  | 'interviewer'
  | 'actor'
  | 'documentarian'
  | 'presenter'
  | 'narrator'
  | 'character';

export interface CinematicWorld {
  environment: string;
  background: string;
  lighting: string;
  atmosphere: string;
  props: string[];
  visualStyle: string;
}

export interface CharacterContinuity {
  id: string;
  name: string;
  appearance: string;
  wardrobe: string;
  voiceProfile?: string;
  personality: string;
  continuityKey: string;
}

export interface CinematicScene {
  id: string;
  sceneNumber: number;
  durationSeconds: number;
  location: string;
  world: CinematicWorld;
  characters: CharacterContinuity[];
  action: string;
  dialogue?: string;
  camera: string;
  audio: string;
  transition?: string;
  continuityNotes: string[];
}

export interface CinematicMoviePlan {
  title: string;
  subject: CinematicSubject;
  role: PerformanceRole;
  premise: string;
  style: string;
  aspectRatio: string;
  targetDurationSeconds: number;
  characters: CharacterContinuity[];
  scenes: CinematicScene[];
  musicDirection: string;
  soundDesign: string;
  narration?: string;
}

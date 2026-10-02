export interface MovieCharacter {
  id: string;
  name: string;
  role: string;
  genderPresentation?: 'male' | 'female' | 'neutral' | 'custom';
  appearance: string;
  wardrobe: string;
  personality: string;
  voiceDescription: string;
  voiceId?: string;
  continuityKey: string;
}

export interface MovieScene {
  id: string;
  number: number;
  title: string;
  location: string;
  timeOfDay: string;
  background: string;
  lighting: string;
  camera: string;
  action: string;
  dialogue: string;
  characters: string[];
  audio: string;
  durationSeconds: number;
  continuityKey: string;
}

export interface MoviePlan {
  id: string;
  title: string;
  genre: string;
  subject: string;
  role: string;
  visualStyle: string;
  aspectRatio: string;
  targetDurationSeconds: number;
  synopsis: string;
  characters: MovieCharacter[];
  scenes: MovieScene[];
  musicDirection: string;
  soundDirection: string;
}

export interface PipelineResult {
  stage: string;
  status: 'ready' | 'blocked' | 'completed';
  message: string;
  data?: unknown;
}

export type CameraMood =
  | 'natural'
  | 'cinematic'
  | 'warm'
  | 'cool'
  | 'dramatic'
  | 'soft'
  | 'vibrant'
  | 'dark'
  | 'bright'
  | 'custom';

export type CameraBackgroundMode =
  | 'original'
  | 'blur'
  | 'remove'
  | 'replace'
  | 'virtual';

export type CameraEdgeMode =
  | 'natural'
  | 'soft'
  | 'sharp'
  | 'glow'
  | 'outline'
  | 'auto';

export interface LiveCameraFrame {
  timestamp: number;
  width: number;
  height: number;
  hasSubject: boolean;
  subjectConfidence: number;
  backgroundConfidence: number;
  faceDetected: boolean;
  motionScore: number;
  brightness: number;
}

export interface LiveCameraPrompt {
  prompt: string;
  background?: string;
  mood?: CameraMood;
  edge?: CameraEdgeMode;
  imageToVideo?: boolean;
  cinematic?: boolean;
  durationSeconds?: number;
}

export interface LiveCameraPlan {
  background: CameraBackgroundMode;
  backgroundPrompt?: string;
  edge: CameraEdgeMode;
  mood: CameraMood;
  imageToVideo: boolean;
  cinematic: boolean;
  durationSeconds: number;
  confidence: number;
  actions: string[];
}

export interface LiveCameraResult {
  status: 'ready' | 'needs-camera' | 'needs-provider' | 'failed';
  plan: LiveCameraPlan;
  frame?: LiveCameraFrame;
  verified: boolean;
  message: string;
}

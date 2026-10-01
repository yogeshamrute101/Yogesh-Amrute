export type AutoMediaType = 'image' | 'video' | 'audio' | 'unknown';

export type AutoEditOperation =
  | 'background-remove'
  | 'background-change'
  | 'crop'
  | 'resize'
  | 'move'
  | 'rotate'
  | 'straighten'
  | 'brightness'
  | 'contrast'
  | 'saturation'
  | 'sharpness'
  | 'clarity'
  | 'denoise'
  | 'upscale'
  | 'stabilize'
  | 'auto-trim'
  | 'silence-trim'
  | 'scene-trim'
  | 'reframe'
  | 'audio-cleanup'
  | 'captions'
  | 'export-optimize';

export type AutoOperationStatus =
  | 'planned'
  | 'executed'
  | 'verified'
  | 'failed'
  | 'not-connected'
  | 'skipped';

export interface MediaQualitySignals {
  width?: number;
  height?: number;
  durationMs?: number;
  sharpness?: number;
  brightness?: number;
  contrast?: number;
  noise?: number;
  blur?: number;
}

export interface AutoMediaInput {
  id: string;
  type: AutoMediaType;
  name?: string;
  mimeType?: string;
  uri?: string;
  quality?: MediaQualitySignals;
  hasAudio?: boolean;
  hasSpeech?: boolean;
  hasText?: boolean;
  hasSubject?: boolean;
  backgroundDetected?: boolean;
  sceneCount?: number;
}

export interface AutoEditOperationResult {
  operation: AutoEditOperation;
  status: AutoOperationStatus;
  verified: boolean;
  message: string;
}

export interface AutoMediaPlan {
  mediaId: string;
  mediaType: AutoMediaType;
  operations: AutoEditOperation[];
  reason: string[];
  requiresProvider: boolean;
  approvalRequired: boolean;
}

export interface AutoMediaResult {
  mediaId: string;
  status:
    | 'completed'
    | 'partially-completed'
    | 'not-connected'
    | 'failed'
    | 'needs-review';
  plan: AutoMediaPlan;
  operations: AutoEditOperationResult[];
  verified: boolean;
  outputUri?: string;
  summary: string;
}

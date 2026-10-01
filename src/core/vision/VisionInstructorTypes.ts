export type VisionSignal =
  | 'face-detected'
  | 'gaze'
  | 'expression-cue'
  | 'gesture'
  | 'object'
  | 'scene'
  | 'unknown';

export type VisualState =
  | 'attentive'
  | 'possibly-confused'
  | 'possibly-tired'
  | 'possibly-distracted'
  | 'neutral'
  | 'unknown';

export type VisionPermission =
  | 'not-requested'
  | 'granted'
  | 'denied';

export interface VisionFrameInput {
  timestampMs: number;
  signals: VisionSignal[];
  state?: VisualState;
  confidence?: number;
  permission: VisionPermission;
}

export interface VisionUnderstanding {
  state: VisualState;
  confidence: number;
  signals: VisionSignal[];
  explanation: string;
  requiresConfirmation: boolean;
}

export interface VisionInstructorResult {
  status: 'ready' | 'permission-required' | 'insufficient-data';
  understanding: VisionUnderstanding;
  suggestedActions: string[];
  verified: boolean;
}

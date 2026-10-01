export type MouthSignal =
  | 'mouth-open'
  | 'mouth-closed'
  | 'mouth-moving'
  | 'mouth-unknown';

export type LipSyncStatus =
  | 'synced'
  | 'desynced'
  | 'insufficient-data'
  | 'audio-required';

export interface MouthFrame {
  timestampMs: number;
  signal: MouthSignal;
  openness?: number;
  confidence?: number;
}

export interface SpeechFrame {
  timestampMs: number;
  durationMs?: number;
  phoneme?: string;
  confidence?: number;
}

export interface LipSyncInput {
  mouthFrames: MouthFrame[];
  speechFrames?: SpeechFrame[];
}

export interface LipSyncResult {
  status: LipSyncStatus;
  movementDetected: boolean;
  synchronizationScore: number;
  mouthFrames: MouthFrame[];
  speechFrames: SpeechFrame[];
  explanation: string;
  verified: boolean;
}

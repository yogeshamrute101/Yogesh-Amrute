export type MultimodalSignal =
  | 'text'
  | 'image'
  | 'video'
  | 'audio'
  | 'camera'
  | 'mouth'
  | 'gaze'
  | 'gesture';

export interface MasterMultimodalInput {
  signals: MultimodalSignal[];
  userInstruction?: string;
  cameraPermission?: 'granted' | 'denied' | 'not-requested';
}

export interface MasterMultimodalDecision {
  intent: string;
  signalsUsed: MultimodalSignal[];
  actionRequired: boolean;
  confirmationRequired: boolean;
  explanation: string;
}

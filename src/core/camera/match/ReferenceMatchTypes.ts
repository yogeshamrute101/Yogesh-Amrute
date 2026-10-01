export type ReferenceMatchDimension =
  | 'identity'
  | 'face'
  | 'pose'
  | 'framing'
  | 'composition'
  | 'scale'
  | 'position'
  | 'lighting'
  | 'color'
  | 'background'
  | 'edge'
  | 'clothing'
  | 'style';

export interface ReferencePhoto {
  id: string;
  name?: string;
  uri: string;
  width?: number;
  height?: number;
  mimeType?: string;
}

export interface ReferenceFeatures {
  faceDetected: boolean;
  subjectDetected: boolean;
  poseDetected: boolean;
  backgroundDetected: boolean;
  dominantColors: string[];
  aspectRatio: number;
  subjectCenterX: number;
  subjectCenterY: number;
  subjectScale: number;
  lightingLevel: number;
  confidence: number;
}

export interface LiveReferenceFrame {
  timestamp: number;
  width: number;
  height: number;
  faceDetected: boolean;
  subjectDetected: boolean;
  poseDetected: boolean;
  brightness: number;
  confidence: number;
}

export interface ReferenceMatchScore {
  dimension: ReferenceMatchDimension;
  score: number;
  verified: boolean;
  reason: string;
}

export interface ReferenceMatchPlan {
  referenceId: string;
  operations: string[];
  targetDimensions: ReferenceMatchDimension[];
  minimumScore: number;
  multipleResults: number;
}

export interface ReferenceMatchCandidate {
  id: string;
  sourceReferenceId: string;
  outputUri?: string;
  scores: ReferenceMatchScore[];
  overallScore: number;
  verified: boolean;
  status:
    | 'verified'
    | 'needs-provider'
    | 'failed'
    | 'needs-review';
  message: string;
}

export interface ReferenceMatchResult {
  status:
    | 'verified'
    | 'partial'
    | 'needs-provider'
    | 'failed'
    | 'needs-review';
  candidates: ReferenceMatchCandidate[];
  bestCandidateId?: string;
  verified: boolean;
  message: string;
}

export type ProcessingMode =
  | "UNDERSTAND"
  | "ANALYZE"
  | "REASON"
  | "CALCULATE"
  | "PLAN"
  | "SIMULATE"
  | "VERIFY"
  | "LEARN";

export interface ProcessingRequest {
  id: string;
  mode: ProcessingMode;
  input: unknown;
  context?: Record<string, unknown>;
}

export interface ProcessingResult {
  id: string;
  mode: ProcessingMode;
  output: unknown;
  confidence: number;
  verified: boolean;
  evidenceIds: string[];
}

export class InternalProcessor {
  process(request: ProcessingRequest): ProcessingResult {
    return {
      id: request.id,
      mode: request.mode,
      output: null,
      confidence: 0,
      verified: false,
      evidenceIds: [],
    };
  }
}

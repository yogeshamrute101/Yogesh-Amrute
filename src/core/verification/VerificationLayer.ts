export type VerificationResult = {
  verified: boolean;
  confidence: number;
  evidence: string[];
  warnings: string[];
};

export class VerificationLayer {
  verify(input: {
    claim: string;
    evidence?: string[];
    confidence?: number;
  }): VerificationResult {
    const evidence = input.evidence ?? [];
    const confidence = Math.max(0, Math.min(1, input.confidence ?? 0));
    return {
      verified: evidence.length > 0 && confidence >= 0.7,
      confidence,
      evidence,
      warnings: evidence.length === 0 ? ["No evidence supplied"] : []
    };
  }
}

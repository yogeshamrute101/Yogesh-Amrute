export type Explanation = {
  action: string;
  reason: string;
  evidence: string[];
  confidence: number;
  assumptions: string[];
};

export class ExplainabilityLayer {
  explain(input: Explanation) {
    return {
      ...input,
      confidence: Math.max(0, Math.min(1, input.confidence))
    };
  }
}

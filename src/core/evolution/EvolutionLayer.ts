export type Improvement = {
  area: string;
  problem: string;
  proposal: string;
  confidence: number;
};

export class EvolutionLayer {
  propose(input: Omit<Improvement, "confidence"> & { confidence?: number }) {
    return {
      ...input,
      confidence: Math.max(0, Math.min(1, input.confidence ?? 0.5))
    };
  }
}

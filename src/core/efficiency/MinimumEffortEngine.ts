export interface EffortEstimate {
  steps: number;
  estimatedCost: number;
  estimatedTimeMs?: number;
  resources: string[];
}

export interface EfficiencyCandidate {
  id: string;
  steps: string[];
  effort: EffortEstimate;
  expectedCorrectness: number;
  verificationCost: number;
  dependencies?: string[];
}

export class MinimumEffortEngine {
  select(candidates: EfficiencyCandidate[]) {
    if (!candidates.length) return undefined;

    return [...candidates].sort((a, b) => {
      const scoreA =
        a.effort.estimatedCost +
        a.effort.steps +
        a.verificationCost -
        a.expectedCorrectness * 10;

      const scoreB =
        b.effort.estimatedCost +
        b.effort.steps +
        b.verificationCost -
        b.expectedCorrectness * 10;

      return scoreA - scoreB;
    })[0];
  }
}

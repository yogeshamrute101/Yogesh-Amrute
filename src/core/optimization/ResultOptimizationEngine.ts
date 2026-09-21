export interface OptimizationTarget {
  goal: string;
  constraints: string[];
  correctnessRequired: number;
  minimize: ("TIME" | "STEPS" | "COST" | "RESOURCES")[];
}

export interface OptimizationResult {
  goal: string;
  selectedPath: string[];
  estimatedEffort: number;
  expectedCorrectness: number;
  verified: boolean;
  reason: string;
}

export class ResultOptimizationEngine {
  optimize(
    target: OptimizationTarget,
    paths: {
      steps: string[];
      effort: number;
      expectedCorrectness: number;
    }[]
  ): OptimizationResult | undefined {
    const valid = paths.filter(
      path => path.expectedCorrectness >= target.correctnessRequired
    );

    if (!valid.length) return undefined;

    const selected = [...valid].sort((a, b) => {
      const scoreA =
        a.effort +
        a.steps.length -
        a.expectedCorrectness * 10;

      const scoreB =
        b.effort +
        b.steps.length -
        b.expectedCorrectness * 10;

      return scoreA - scoreB;
    })[0];

    return {
      goal: target.goal,
      selectedPath: selected.steps,
      estimatedEffort: selected.effort,
      expectedCorrectness: selected.expectedCorrectness,
      verified: false,
      reason: "Selected the lowest-effort path meeting the correctness threshold.",
    };
  }
}

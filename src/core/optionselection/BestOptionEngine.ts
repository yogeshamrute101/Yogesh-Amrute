export interface DecisionOption {
  id: string;
  name: string;
  goalFit: number;
  correctness: number;
  safety: number;
  reliability: number;
  evidence: number;
  experience: number;
  expectedBenefit: number;
  timeCost: number;
  resourceCost: number;
  complexity: number;
  risk: number;
  reversible: boolean;
  available: boolean;
  metadata?: Record<string, unknown>;
}

export interface DecisionWeights {
  goalFit: number;
  correctness: number;
  safety: number;
  reliability: number;
  evidence: number;
  experience: number;
  expectedBenefit: number;
  timeCost: number;
  resourceCost: number;
  complexity: number;
  risk: number;
  reversibility: number;
}

export interface OptionEvaluation {
  optionId: string;
  score: number;
  eligible: boolean;
  reasons: string[];
}

export interface BestOptionResult {
  selectedOptionId?: string;
  evaluations: OptionEvaluation[];
  confidence: number;
  reason: string;
}

const DEFAULT_WEIGHTS: DecisionWeights = {
  goalFit: 1.0,
  correctness: 1.0,
  safety: 1.0,
  reliability: 0.9,
  evidence: 0.8,
  experience: 0.7,
  expectedBenefit: 0.9,
  timeCost: 0.5,
  resourceCost: 0.4,
  complexity: 0.3,
  risk: 1.0,
  reversibility: 0.4,
};

export class BestOptionEngine {
  constructor(
    private readonly weights: DecisionWeights = DEFAULT_WEIGHTS
  ) {}

  evaluate(option: DecisionOption): OptionEvaluation {
    if (!option.available) {
      return {
        optionId: option.id,
        score: Number.NEGATIVE_INFINITY,
        eligible: false,
        reasons: ["Option is unavailable."],
      };
    }

    const safetyGate = option.safety >= 0.5;
    const correctnessGate = option.correctness >= 0.5;

    if (!safetyGate || !correctnessGate) {
      return {
        optionId: option.id,
        score: Number.NEGATIVE_INFINITY,
        eligible: false,
        reasons: [
          ...(!safetyGate ? ["Safety threshold not met."] : []),
          ...(!correctnessGate
            ? ["Correctness threshold not met."]
            : []),
        ],
      };
    }

    const w = this.weights;

    const score =
      option.goalFit * w.goalFit +
      option.correctness * w.correctness +
      option.safety * w.safety +
      option.reliability * w.reliability +
      option.evidence * w.evidence +
      option.experience * w.experience +
      option.expectedBenefit * w.expectedBenefit +
      (1 - option.timeCost) * w.timeCost +
      (1 - option.resourceCost) * w.resourceCost +
      (1 - option.complexity) * w.complexity +
      (1 - option.risk) * w.risk +
      (option.reversible ? 1 : 0) * w.reversibility;

    return {
      optionId: option.id,
      score,
      eligible: true,
      reasons: ["Passed availability, safety and correctness gates."],
    };
  }

  select(options: DecisionOption[]): BestOptionResult {
    const evaluations = options.map(option =>
      this.evaluate(option)
    );

    const eligible = evaluations
      .filter(x => x.eligible)
      .sort((a, b) => b.score - a.score);

    if (!eligible.length) {
      return {
        evaluations,
        confidence: 0,
        reason: "No eligible option passed the required gates.",
      };
    }

    const selected = eligible[0];
    const second = eligible[1];

    const separation =
      second
        ? Math.max(0, selected.score - second.score)
        : selected.score;

    const confidence = Math.min(
      1,
      0.5 + separation / Math.max(1, Math.abs(selected.score))
    );

    return {
      selectedOptionId: selected.optionId,
      evaluations,
      confidence,
      reason:
        "Selected the highest-scoring eligible option under the configured criteria.",
    };
  }
}

export interface ScientificHypothesis {
  id: string;
  statement: string;
  predictions: string[];
  assumptions: string[];
}

export interface Experiment {
  id: string;
  hypothesisId: string;
  procedure: string[];
  expectedResult: string;
  actualResult?: string;
  status: "PROPOSED" | "RUNNING" | "COMPLETED" | "FAILED";
}

export interface ScientificConclusion {
  conclusion: string;
  supportingEvidence: string[];
  confidence: number;
  limitations: string[];
  reproducibilityRequired: boolean;
}

export class ScientificMethod {
  formulateHypothesis(
    statement: string,
    predictions: string[],
    assumptions: string[] = []
  ): ScientificHypothesis {
    return {
      id: `hypothesis-${Date.now()}`,
      statement,
      predictions,
      assumptions,
    };
  }

  designExperiment(
    hypothesis: ScientificHypothesis,
    procedure: string[],
    expectedResult: string
  ): Experiment {
    return {
      id: `experiment-${Date.now()}`,
      hypothesisId: hypothesis.id,
      procedure,
      expectedResult,
      status: "PROPOSED",
    };
  }

  conclude(
    conclusion: string,
    supportingEvidence: string[],
    confidence: number,
    limitations: string[]
  ): ScientificConclusion {
    return {
      conclusion,
      supportingEvidence,
      confidence,
      limitations,
      reproducibilityRequired: true,
    };
  }
}

import {
  MultimodalPerception,
  PerceptionInput,
  PerceptionResult,
} from "../perception/MultimodalPerception";

export interface ActivityEvidence {
  sourceInputIds: string[];
  observations: string[];
}

export interface ActivityConclusion {
  activityId: string;
  summary: string;
  evidence: ActivityEvidence;
  confidence: number;
  uncertainty: string[];
  timestamp: number;
}

export class ActivityUnderstanding {
  private perception = new MultimodalPerception();

  analyze(inputs: PerceptionInput[]): ActivityConclusion {
    const results: PerceptionResult[] =
      this.perception.observeMany(inputs);

    const observations = results.flatMap(
      (result) => result.observations
    );

    const sourceInputIds = results.map((result) => result.inputId);

    return {
      activityId: `activity-${Date.now()}`,
      summary: this.buildSummary(results),
      evidence: {
        sourceInputIds,
        observations,
      },
      confidence: this.calculateConfidence(results),
      uncertainty: [
        "Conclusion is based only on available inputs.",
        "Missing or ambiguous evidence must not be treated as fact.",
      ],
      timestamp: Date.now(),
    };
  }

  private buildSummary(results: PerceptionResult[]): string {
    if (results.length === 0) {
      return "No activity can be concluded because no evidence was provided.";
    }

    const types = [...new Set(results.map((r) => r.type))];

    return `Activity analysis completed using: ${types.join(", ")}.`;
  }

  private calculateConfidence(results: PerceptionResult[]): number {
    if (results.length === 0) return 0;

    const multimodalBonus = new Set(results.map((r) => r.type)).size / 3;
    return Math.min(1, multimodalBonus);
  }
}

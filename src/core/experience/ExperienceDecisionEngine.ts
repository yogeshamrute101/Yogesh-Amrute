import {
  ExperienceEngine,
  ExperienceRecord,
} from "./ExperienceEngine";

export interface ExperienceDecision {
  recommendedAction?: string;
  avoidActions: string[];
  confidence: number;
  evidenceCount: number;
  reason: string;
}

export class ExperienceDecisionEngine {
  constructor(private readonly experience = new ExperienceEngine()) {}

  decide(
    domain: string,
    situation: string
  ): ExperienceDecision {
    const pattern = this.experience.buildPattern(
      domain,
      situation
    );

    return {
      recommendedAction: pattern.successfulActions[0],
      avoidActions: pattern.failedActions,
      confidence: pattern.confidence,
      evidenceCount: pattern.evidenceCount,
      reason:
        pattern.evidenceCount > 0
          ? "Decision informed by verified historical experience."
          : "No verified matching experience available.",
    };
  }
}

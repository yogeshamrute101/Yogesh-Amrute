export interface CreationOutcome {
  taskId: string;
  expected?: unknown;
  actual?: unknown;
  verified: boolean;
  errors?: string[];
}

export class OutputLearningEngine {
  learn(outcome: CreationOutcome) {
    return {
      taskId: outcome.taskId,
      verified: outcome.verified,
      lessons: outcome.errors ?? [],
      nextAction: outcome.verified ? "RETAIN_PATTERN" : "DIAGNOSE_AND_CORRECT",
    };
  }
}

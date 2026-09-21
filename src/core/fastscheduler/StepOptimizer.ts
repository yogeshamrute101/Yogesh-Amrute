import { WorkStep } from "./FastAdaptiveScheduler";

export interface StepDecision {
  stepId: string;
  action: "RUN" | "SKIP" | "REPLACE" | "MERGE";
  reason: string;
}

export class StepOptimizer {
  optimize(steps: WorkStep[]): StepDecision[] {
    return steps.map(step => {
      if (!step.required && !step.dependencies?.length) {
        return {
          stepId: step.id,
          action: "SKIP",
          reason: "Not required and has no dependency.",
        };
      }

      if (step.replaceable && step.replacement) {
        return {
          stepId: step.id,
          action: "REPLACE",
          reason: "A declared faster/equivalent replacement exists.",
        };
      }

      return {
        stepId: step.id,
        action: "RUN",
        reason: "Required step.",
      };
    });
  }
}

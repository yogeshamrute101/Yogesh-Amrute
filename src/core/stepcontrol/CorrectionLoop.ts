export type CorrectionAction =
  | "RETRY"
  | "RETURN_TO_CHECKPOINT"
  | "REEXECUTE"
  | "REQUEST_CLARIFICATION"
  | "STOP";

export interface CorrectionDecision {
  action: CorrectionAction;
  reason: string;
  targetStepId?: string;
}

export class CorrectionLoop {
  decide(input: {
    failed: boolean;
    instructionViolation: boolean;
    checkpointAvailable: boolean;
    uncertainty: boolean;
    targetStepId?: string;
  }): CorrectionDecision {
    if (input.instructionViolation && input.checkpointAvailable) {
      return {
        action: "RETURN_TO_CHECKPOINT",
        reason: "Instruction compliance failed; return to verified checkpoint.",
        targetStepId: input.targetStepId,
      };
    }

    if (input.instructionViolation) {
      return {
        action: "REQUEST_CLARIFICATION",
        reason: "Instruction conflict or missing instruction requires clarification.",
      };
    }

    if (input.uncertainty) {
      return {
        action: "STOP",
        reason: "Uncertainty is too high for safe continuation.",
      };
    }

    if (input.failed) {
      return {
        action: "REEXECUTE",
        reason: "Execution failed and requires another controlled attempt.",
        targetStepId: input.targetStepId,
      };
    }

    return {
      action: "RETRY",
      reason: "Controlled retry permitted.",
      targetStepId: input.targetStepId,
    };
  }
}

import { Instruction, ExecutionStep } from "./ReversibleStepController";

export interface ComplianceResult {
  compliant: boolean;
  violations: string[];
  needsReview: boolean;
}

export class InstructionComplianceEngine {
  evaluate(
    step: ExecutionStep,
    instructions: Instruction[],
    result?: unknown
  ): ComplianceResult {
    const required = instructions.filter(
      instruction =>
        instruction.mandatory &&
        step.instructionIds.includes(instruction.id)
    );

    const violations: string[] = [];

    if (!result && required.length > 0) {
      violations.push("MANDATORY_INSTRUCTION_RESULT_MISSING");
    }

    return {
      compliant: violations.length === 0,
      violations,
      needsReview: violations.length > 0,
    };
  }
}

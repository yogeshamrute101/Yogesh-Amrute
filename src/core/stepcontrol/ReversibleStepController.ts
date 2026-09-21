export type StepStatus =
  | "PENDING"
  | "RUNNING"
  | "COMPLETED"
  | "FAILED"
  | "CORRECTION_REQUIRED"
  | "ROLLED_BACK"
  | "BLOCKED";

export interface Instruction {
  id: string;
  text: string;
  priority: number;
  mandatory?: boolean;
}

export interface ExecutionStep {
  id: string;
  sequence: number;
  name: string;
  instructionIds: string[];
  dependsOn?: string[];
  status: StepStatus;
  checkpointId?: string;
  result?: unknown;
  error?: string;
}

export interface Checkpoint {
  id: string;
  stepId: string;
  createdAt: string;
  state: unknown;
  verified: boolean;
}

export class ReversibleStepController {
  private instructions = new Map<string, Instruction>();
  private steps = new Map<string, ExecutionStep>();
  private checkpoints = new Map<string, Checkpoint>();

  registerInstruction(instruction: Instruction) {
    this.instructions.set(instruction.id, { ...instruction });
    return instruction;
  }

  registerStep(step: ExecutionStep) {
    this.steps.set(step.id, { ...step });
    return step;
  }

  startStep(id: string) {
    const step = this.requireStep(id);
    step.status = "RUNNING";
    return step;
  }

  completeStep(id: string, result: unknown) {
    const step = this.requireStep(id);
    step.status = "COMPLETED";
    step.result = result;
    return step;
  }

  markCorrectionRequired(id: string, error: string) {
    const step = this.requireStep(id);
    step.status = "CORRECTION_REQUIRED";
    step.error = error;
    return step;
  }

  createCheckpoint(
    id: string,
    stepId: string,
    state: unknown,
    verified = false
  ) {
    const checkpoint: Checkpoint = {
      id,
      stepId,
      createdAt: new Date().toISOString(),
      state,
      verified,
    };

    this.checkpoints.set(id, checkpoint);

    const step = this.requireStep(stepId);
    step.checkpointId = id;

    return checkpoint;
  }

  rollbackToCheckpoint(id: string) {
    const checkpoint = this.checkpoints.get(id);
    if (!checkpoint) {
      throw new Error(`Checkpoint not found: ${id}`);
    }

    const step = this.requireStep(checkpoint.stepId);
    step.status = "ROLLED_BACK";

    return {
      checkpoint,
      nextAction: "CORRECT_AND_REVALIDATE",
    };
  }

  validateInstructions(stepId: string) {
    const step = this.requireStep(stepId);

    const missing = step.instructionIds.filter(
      id => !this.instructions.has(id)
    );

    return {
      valid: missing.length === 0,
      missingInstructionIds: missing,
    };
  }

  getNextStep(sequence: number) {
    return [...this.steps.values()]
      .filter(step => step.sequence > sequence)
      .sort((a, b) => a.sequence - b.sequence)[0];
  }

  private requireStep(id: string) {
    const step = this.steps.get(id);
    if (!step) throw new Error(`Step not found: ${id}`);
    return step;
  }
}

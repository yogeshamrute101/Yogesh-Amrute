import type {
  UniversalTask,
  VerificationResult,
} from "../types/SystemTypes";

export function verifyTask(
  task: UniversalTask
): VerificationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  if (task.status !== "completed") {
    errors.push("Task did not reach completed state.");
  }

  if (task.result === undefined || task.result === null) {
    warnings.push("Task completed without a result payload.");
  }

  return {
    passed: errors.length === 0,
    errors,
    warnings,
    correctiveActions: errors.length
      ? ["Retry task using an alternate execution path."]
      : [],
    preventiveActions: errors.length
      ? ["Record failure reason for future planning."]
      : [],
  };
}

export interface ExecutionVerification {
  executionId: string;
  startedAt: string;
  completedAt?: string;
  success: boolean;
  verified: boolean;
  error?: string;
}

export function verifyExecution(
  result: ExecutionVerification,
): void {
  if (!result.executionId.trim()) {
    throw new Error("Execution ID is required.");
  }

  if (!result.success) {
    throw new Error(
      result.error || "Execution did not complete successfully.",
    );
  }

  if (!result.verified) {
    throw new Error(
      "Execution completed without verification.",
    );
  }
}

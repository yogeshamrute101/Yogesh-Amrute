import {
  DEFAULT_RECOVERY_POLICY,
  isRetryableError,
} from "./RecoveryPolicy";

export interface RecoveryResult<T> {
  value: T;
  attempts: number;
}

export async function executeWithRecovery<T>(
  operation: () => Promise<T>,
  maxAttempts = DEFAULT_RECOVERY_POLICY.maxAttempts,
): Promise<RecoveryResult<T>> {
  let attempts = 0;
  let lastError: unknown;

  while (attempts < maxAttempts) {
    attempts += 1;

    try {
      return {
        value: await operation(),
        attempts,
      };
    } catch (error) {
      lastError = error;

      if (!isRetryableError(error)) {
        throw error;
      }
    }
  }

  throw new Error(
    `Recovery exhausted after ${attempts} attempts: ${String(lastError)}`,
  );
}

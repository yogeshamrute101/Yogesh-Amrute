export interface RecoveryPolicy {
  maxAttempts: number;
  timeoutMs: number;
  retryableErrors: string[];
}

export const DEFAULT_RECOVERY_POLICY: RecoveryPolicy = {
  maxAttempts: 3,
  timeoutMs: 120_000,
  retryableErrors: [
    "ETIMEDOUT",
    "ECONNRESET",
    "ECONNABORTED",
    "RATE_LIMITED",
  ],
};

export function isRetryableError(
  error: unknown,
  policy: RecoveryPolicy = DEFAULT_RECOVERY_POLICY,
): boolean {
  const message =
    error instanceof Error ? error.message : String(error);

  return policy.retryableErrors.some((code) =>
    message.includes(code),
  );
}

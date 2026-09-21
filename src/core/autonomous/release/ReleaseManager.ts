export interface ReleaseCheck {
  name: string;
  passed: boolean;
  detail: string;
}

export function createReleaseReport(
  checks: ReleaseCheck[]
) {
  return {
    timestamp: new Date().toISOString(),
    passed: checks.every((c) => c.passed),
    checks,
  };
}

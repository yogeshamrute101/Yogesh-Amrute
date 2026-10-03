export interface BoundedExecutionPolicy {
  maxIterations: number;
  maxTasks: number;
  timeoutMs: number;
}

export const DEFAULT_BOUNDED_EXECUTION_POLICY: BoundedExecutionPolicy = {
  maxIterations: 100,
  maxTasks: 100,
  timeoutMs: 120_000,
};

export function assertIterationAllowed(
  iteration: number,
  policy = DEFAULT_BOUNDED_EXECUTION_POLICY,
): void {
  if (iteration >= policy.maxIterations) {
    throw new Error("Autonomous execution iteration limit reached.");
  }
}

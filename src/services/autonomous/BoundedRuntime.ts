import {
  DEFAULT_BOUNDED_EXECUTION_POLICY,
} from "./BoundedExecutionPolicy";

export interface BoundedRuntimeResult<T> {
  value: T;
  iterations: number;
  verified: boolean;
}

export async function runBounded<T>(
  operation: (iteration: number) => Promise<T>,
): Promise<BoundedRuntimeResult<T>> {
  let iteration = 0;

  while (
    iteration < DEFAULT_BOUNDED_EXECUTION_POLICY.maxIterations
  ) {
    iteration += 1;

    try {
      const value = await operation(iteration);

      return {
        value,
        iterations: iteration,
        verified: true,
      };
    } catch (error) {
      if (
        iteration >=
        DEFAULT_BOUNDED_EXECUTION_POLICY.maxIterations
      ) {
        throw error;
      }
    }
  }

  throw new Error(
    "Bounded autonomous execution limit reached.",
  );
}

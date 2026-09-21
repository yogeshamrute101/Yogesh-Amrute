import type { UniversalTask } from "../types/SystemTypes";

export function prepareRecovery(task: UniversalTask): UniversalTask {
  return {
    ...task,
    status: "queued",
    attempts: task.attempts + 1,
    error: undefined,
  };
}

export function shouldRetry(task: UniversalTask, maxAttempts = 3) {
  return task.attempts < maxAttempts;
}

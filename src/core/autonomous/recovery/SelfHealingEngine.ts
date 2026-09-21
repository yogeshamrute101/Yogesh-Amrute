import { AutonomousTask } from "../types";

export class SelfHealingEngine {
  async recover(task: AutonomousTask, error: unknown) {
    const message =
      error instanceof Error ? error.message : String(error);

    const nextAttempt = task.attempts + 1;

    if (nextAttempt <= 2) {
      return {
        action: "retry",
        task: {
          ...task,
          attempts: nextAttempt,
          status: "queued" as const,
          error: message,
          priority: Math.max(1, task.priority - 5),
        },
      };
    }

    return {
      action: "fail",
      task: {
        ...task,
        attempts: nextAttempt,
        status: "failed" as const,
        error: message,
      },
    };
  }
}

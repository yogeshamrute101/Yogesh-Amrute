import { TaskQueue } from "../queue/TaskQueue";
import { createUniversalPlan } from "../planner/UniversalPlanner";
import { executeTask } from "../executor/UniversalExecutor";
import { verifyTask } from "../verification/UniversalVerifier";
import { prepareRecovery, shouldRetry } from "../recovery/SelfRecovery";
import type {
  Priority,
  SystemResult,
} from "../types/SystemTypes";

export async function runUniversalTask(
  goal: string,
  input: unknown = {},
  priority: Priority = "normal",
  handler?: Parameters<typeof executeTask>[1]
): Promise<SystemResult> {
  const plan = createUniversalPlan(goal, input, priority);
  const queue = new TaskQueue();
  queue.addMany(plan.tasks);

  let attempts = 0;
  let lastVerification = {
    passed: false,
    errors: ["Task was not executed."],
    warnings: [],
    correctiveActions: [],
    preventiveActions: [],
  };

  while (queue.next()) {
    const task = queue.next()!;
    queue.remove(task.id);

    await executeTask(task, handler);
    attempts = task.attempts;

    lastVerification = verifyTask(task);

    if (lastVerification.passed) {
      return {
        success: true,
        result: task.result,
        plan,
        verification: lastVerification,
        attempts,
        message: "Task completed and verified.",
      };
    }

    if (shouldRetry(task)) {
      queue.add(prepareRecovery(task));
    } else {
      return {
        success: false,
        result: task.result,
        plan,
        verification: lastVerification,
        attempts,
        message: "Task could not be completed after recovery attempts.",
      };
    }
  }

  return {
    success: false,
    plan,
    verification: lastVerification,
    attempts,
    message: "No executable task remained.",
  };
}

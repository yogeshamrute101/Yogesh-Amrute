import type {
  UniversalTask,
} from "../types/SystemTypes";
import {
  recordExperience,
  findRelevantExperience,
} from "../learning/ExperienceMemory";

export async function executeTask(
  task: UniversalTask,
  handler?: (task: UniversalTask) => Promise<unknown>
): Promise<UniversalTask> {
  task.status = "running";
  task.attempts += 1;

  try {
    const previous = findRelevantExperience(task.title);

    const result = handler
      ? await handler(task)
      : {
          goal: task.title,
          input: task.input,
          previousExperience: previous,
          mode: "universal",
        };

    task.result = result;
    task.status = "completed";

    recordExperience(
      task.title,
      true,
      "universal-executor"
    );

    return task;
  } catch (error) {
    task.error =
      error instanceof Error ? error.message : String(error);
    task.status = "failed";

    recordExperience(
      task.title,
      false,
      "universal-executor"
    );

    return task;
  }
}

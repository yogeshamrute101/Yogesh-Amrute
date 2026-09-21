import type {
  ExecutionPlan,
  UniversalTask,
  Priority,
} from "../types/SystemTypes";

function id() {
  return `task_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}

export function createUniversalPlan(
  goal: string,
  input: unknown,
  priority: Priority = "normal"
): ExecutionPlan {
  const task: UniversalTask = {
    id: id(),
    title: goal,
    input,
    priority,
    status: "queued",
    dependencies: [],
    createdAt: Date.now(),
    attempts: 0,
  };

  return {
    goal,
    tasks: [task],
    parallelGroups: [[task.id]],
    unnecessarySteps: [],
  };
}

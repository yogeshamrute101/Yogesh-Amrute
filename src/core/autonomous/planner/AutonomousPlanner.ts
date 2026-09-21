import { AutonomousTask } from "../types";

function id() {
  return `task_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}

export function planGoal(goal: string): AutonomousTask[] {
  const clean = goal.trim();

  if (!clean) return [];

  return [
    {
      id: id(),
      title: "Understand goal",
      description: clean,
      priority: 100,
      createdAt: Date.now(),
      status: "queued",
      dependencies: [],
      attempts: 0,
      tags: ["planning"],
    },
    {
      id: id(),
      title: "Determine required actions",
      description: "Select the minimum valid path to completion.",
      priority: 90,
      createdAt: Date.now(),
      status: "queued",
      dependencies: [],
      attempts: 0,
      tags: ["planning", "optimization"],
    },
    {
      id: id(),
      title: "Execute required work",
      description: clean,
      priority: 80,
      createdAt: Date.now(),
      status: "queued",
      dependencies: [],
      attempts: 0,
      tags: ["execution"],
    },
    {
      id: id(),
      title: "Verify result",
      description: "Verify that the requested goal was completed.",
      priority: 70,
      createdAt: Date.now(),
      status: "queued",
      dependencies: [],
      attempts: 0,
      tags: ["verification"],
    },
  ];
}

export function removeUnnecessaryTasks(
  tasks: AutonomousTask[]
): AutonomousTask[] {
  const seen = new Set<string>();

  return tasks.filter((task) => {
    const key = `${task.title}:${task.description ?? ""}`.toLowerCase();

    if (seen.has(key)) return false;

    seen.add(key);
    return true;
  });
}

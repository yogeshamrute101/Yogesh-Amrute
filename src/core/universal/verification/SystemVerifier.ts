import { universalSystem } from "../UniversalSystem";

export function verifySystemIntegrity() {
  const state = universalSystem.getState();

  const invalidTasks = state.tasks.filter(
    task =>
      !task.id ||
      !task.title ||
      task.completedSteps.some(step => !task.steps.includes(step))
  );

  return {
    healthy: invalidTasks.length === 0,
    invalidTaskCount: invalidTasks.length,
    taskCount: state.tasks.length,
    completedCount: state.completedCount,
    recoveredCount: state.recoveredCount,
  };
}

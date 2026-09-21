import { universalSystem } from "./UniversalSystem";
import { selfManager } from "./orchestration/SelfManager";

export async function runUniversalCommand(
  command: string,
  priority = 0
) {
  const task = universalSystem.addTask(
    command,
    command,
    priority
  );

  await selfManager.process();

  return {
    task,
    state: universalSystem.getState(),
  };
}

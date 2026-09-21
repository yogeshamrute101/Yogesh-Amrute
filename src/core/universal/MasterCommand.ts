import { masterOrchestrator } from "./MasterOrchestrator";

export async function executeMasterCommand(
  command: string,
  priority = 0
) {
  if (!command.trim()) {
    return {
      success: false,
      message: "Command is empty.",
    };
  }

  return masterOrchestrator.execute(
    command.trim(),
    priority
  );
}

export function getMasterSystemState() {
  return masterOrchestrator.state();
}

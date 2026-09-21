import {
  executeMasterCommand,
  getMasterSystemState,
} from "./MasterCommand";

export async function executeVidoAICommand(
  command: string,
  priority = 0
) {
  const result = await executeMasterCommand(command, priority);

  return {
    ...result,
    systemState: getMasterSystemState(),
  };
}

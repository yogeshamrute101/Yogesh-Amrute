import {
  executeWithRecovery,
} from "./RecoveryRuntime";

export async function runRecoverable<T>(
  operation: () => Promise<T>,
) {
  return executeWithRecovery(operation);
}

export interface AutonomousExecutionRequest {
  taskId: string;
  goal: string;
}

export interface AutonomousExecutionResult {
  status: "completed";
  output: unknown;
}

export interface AutonomousExecutionAdapter {
  canExecute(): boolean;
  execute(
    request: AutonomousExecutionRequest
  ): Promise<AutonomousExecutionResult>;
}

/**
 * Explicitly unavailable adapter.
 *
 * This prevents the application from claiming that autonomous execution
 * happened when no real execution graph/provider has been connected.
 */
export class UnconfiguredAutonomousExecutionAdapter
  implements AutonomousExecutionAdapter
{
  canExecute(): boolean {
    return false;
  }

  async execute(
    _request: AutonomousExecutionRequest
  ): Promise<AutonomousExecutionResult> {
    throw new Error(
      "Autonomous execution adapter is not configured"
    );
  }
}

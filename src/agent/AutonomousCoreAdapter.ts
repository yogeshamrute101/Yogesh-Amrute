import { executeWithAgentTeam } from "./team/AgentTeamRuntime";

export type CoreExecutionContext = {
  taskId: string;
  prompt: string;
  capabilities?: string[];
};

export type CoreExecutionResult = {
  success: boolean;
  output?: unknown;
  error?: string;
};

export interface AutonomousCoreAdapter {
  execute(context: CoreExecutionContext): Promise<CoreExecutionResult>;
  verify?(result: CoreExecutionResult): Promise<boolean>;
  recover?(
    context: CoreExecutionContext,
    error: unknown,
  ): Promise<CoreExecutionResult>;
}

export class MasterAgentCoreAdapter implements AutonomousCoreAdapter {
  async execute(
    context: CoreExecutionContext,
  ): Promise<CoreExecutionResult> {
    try {
      const output = await executeWithAgentTeam(
        context.taskId,
        context.prompt,
      );

      return {
        success: output.success,
        output,
        ...(output.success
          ? {}
          : {
              error:
                output.errors.join("; ") ||
                "Agent team execution failed.",
            }),
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : String(error),
      };
    }
  }

  async verify(result: CoreExecutionResult): Promise<boolean> {
    if (!result.success || result.output === undefined) {
      return false;
    }

    const output = result.output as {
      results?: unknown[];
    };

    return Array.isArray(output.results);
  }

  async recover(
    context: CoreExecutionContext,
    error: unknown,
  ): Promise<CoreExecutionResult> {
    return {
      success: false,
      error: `Recovery required for ${context.taskId}: ${
        error instanceof Error ? error.message : String(error)
      }`,
    };
  }
}

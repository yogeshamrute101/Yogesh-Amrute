import { registerBuiltInAgents } from "./team/BuiltInAgents";

import {
  AutonomousCoreAdapter,
  CoreExecutionContext,
  CoreExecutionResult,
} from "./AutonomousCoreAdapter";

export type AutonomousExecutionOptions = {
  maxAttempts?: number;
  capabilities?: string[];
};

registerBuiltInAgents();

export class AutonomousExecutionEngine {
  constructor(private readonly core: AutonomousCoreAdapter) {}

  async execute(
    taskId: string,
    prompt: string,
    options: AutonomousExecutionOptions = {},
  ): Promise<CoreExecutionResult> {
    const maxAttempts = Math.min(
      5,
      Math.max(1, options.maxAttempts ?? 3),
    );

    const context: CoreExecutionContext = {
      taskId,
      prompt,
      capabilities: options.capabilities ?? [],
    };

    let lastResult: CoreExecutionResult = {
      success: false,
      error: "Execution did not start.",
    };

    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      try {
        lastResult = await this.core.execute(context);

        if (lastResult.success) {
          const verified = this.core.verify
            ? await this.core.verify(lastResult)
            : true;

          if (verified) {
            return lastResult;
          }

          lastResult = {
            success: false,
            error: `Execution verification failed on attempt ${attempt}.`,
          };
        }
      } catch (error) {
        lastResult = {
          success: false,
          error: error instanceof Error ? error.message : String(error),
        };

        if (this.core.recover && attempt < maxAttempts) {
          const recovered = await this.core.recover(context, error);

          if (recovered.success) {
            return recovered;
          }
        }
      }
    }

    return lastResult;
  }
}

import {
  AutoEditOperation,
  AutoMediaInput,
  AutoMediaResult,
} from './AutoMediaTypes';
import { AutoMediaPlanner } from './AutoMediaPlanner';

export interface AutoMediaCapability {
  operation: AutoEditOperation;
  available: boolean;
  execute?: (
    input: AutoMediaInput
  ) => Promise<{
    outputUri?: string;
    message: string;
    verified: boolean;
  }>;
}

export class AutoMediaExecutor {
  private readonly planner = new AutoMediaPlanner();
  private readonly capabilities = new Map<
    AutoEditOperation,
    AutoMediaCapability
  >();

  register(capability: AutoMediaCapability): void {
    this.capabilities.set(capability.operation, capability);
  }

  async execute(input: AutoMediaInput): Promise<AutoMediaResult> {
    const plan = this.planner.plan(input);

    const operations = [];
    let outputUri: string | undefined;
    let successful = 0;
    let attempted = 0;

    for (const operation of plan.operations) {
      const capability = this.capabilities.get(operation);

      if (!capability?.available || !capability.execute) {
        operations.push({
          operation,
          status: 'not-connected' as const,
          verified: false,
          message: `Capability '${operation}' is not connected to a real media engine.`,
        });
        continue;
      }

      attempted++;

      try {
        const result = await capability.execute(input);

        operations.push({
          operation,
          status: result.verified ? 'verified' : 'executed',
          verified: result.verified,
          message: result.message,
        });

        if (result.outputUri) {
          outputUri = result.outputUri;
        }

        if (result.verified) successful++;
      } catch (error) {
        operations.push({
          operation,
          status: 'failed' as const,
          verified: false,
          message:
            error instanceof Error ? error.message : 'Media operation failed.',
        });
      }
    }

    const allVerified =
      operations.length > 0 &&
      operations.every(operation => operation.verified);

    const hasFailure = operations.some(
      operation => operation.status === 'failed'
    );

    let status: AutoMediaResult['status'];

    if (hasFailure) {
      status = 'failed';
    } else if (allVerified) {
      status = 'completed';
    } else if (attempted > 0 && successful > 0) {
      status = 'partially-completed';
    } else {
      status = 'not-connected';
    }

    return {
      mediaId: input.id,
      status,
      plan,
      operations,
      verified: allVerified,
      outputUri,
      summary: allVerified
        ? 'Automatic media editing completed and verified.'
        : 'Automatic editing plan was evaluated, but one or more real capabilities are not connected or verified.',
    };
  }
}

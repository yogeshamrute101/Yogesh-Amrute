import {
  WorkflowNode,
  WorkflowNodeExecutor,
  WorkflowExecutionContext,
} from './WorkflowEngine';

export interface VerificationResult {
  verified: boolean;
  checked: boolean;
  reason?: string;
  value: unknown;
}

export class VerifyNodeExecutor implements WorkflowNodeExecutor {
  async execute(
    node: WorkflowNode,
    context: WorkflowExecutionContext
  ): Promise<VerificationResult> {
    const value = context.previousOutput;

    if (value === undefined || value === null) {
      return {
        verified: false,
        checked: true,
        reason: 'No previous workflow output is available',
        value,
      };
    }

    if (
      typeof value === 'object' &&
      value !== null &&
      'status' in value &&
      (value as { status?: unknown }).status === 'failed'
    ) {
      return {
        verified: false,
        checked: true,
        reason: 'Previous workflow step reported failure',
        value,
      };
    }

    const config = node.config ?? {};

    if (config.requireValue === true) {
      const hasValue =
        typeof value === 'string'
          ? value.trim().length > 0
          : true;

      if (!hasValue) {
        return {
          verified: false,
          checked: true,
          reason: 'Verification requires a non-empty value',
          value,
        };
      }
    }

    if (config.expectedStatus !== undefined) {
      const actualStatus =
        typeof value === 'object' &&
        value !== null &&
        'status' in value
          ? (value as { status?: unknown }).status
          : undefined;

      if (actualStatus !== config.expectedStatus) {
        return {
          verified: false,
          checked: true,
          reason: `Expected status "${String(config.expectedStatus)}" but received "${String(actualStatus)}"`,
          value,
        };
      }
    }

    return {
      verified: true,
      checked: true,
      value,
    };
  }
}

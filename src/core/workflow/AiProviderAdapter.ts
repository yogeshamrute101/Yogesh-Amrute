import {
  WorkflowNode,
  WorkflowExecutionContext,
} from './WorkflowEngine';
import { AgentExecutionAdapter } from './AgentNodeExecutor';

export interface WorkflowAiProvider {
  execute(
    prompt: string,
    options?: {
      node?: WorkflowNode;
      context?: WorkflowExecutionContext;
    }
  ): Promise<unknown>;
}

export class AiProviderAdapter implements AgentExecutionAdapter {
  constructor(private readonly provider: WorkflowAiProvider) {}

  async execute(
    prompt: string,
    node: WorkflowNode,
    context: WorkflowExecutionContext
  ): Promise<unknown> {
    const normalizedPrompt = String(prompt ?? '').trim();

    if (!normalizedPrompt) {
      throw new Error('AI provider adapter requires a prompt');
    }

    if (!this.provider || typeof this.provider.execute !== 'function') {
      throw new Error(
        'AI provider is not connected to the workflow runtime'
      );
    }

    return this.provider.execute(normalizedPrompt, {
      node,
      context,
    });
  }
}

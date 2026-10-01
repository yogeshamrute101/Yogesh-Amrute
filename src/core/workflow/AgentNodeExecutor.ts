import {
  WorkflowNode,
  WorkflowNodeExecutor,
  WorkflowExecutionContext,
} from './WorkflowEngine';

export interface AgentExecutionAdapter {
  execute(
    prompt: string,
    node: WorkflowNode,
    context: WorkflowExecutionContext
  ): Promise<unknown>;
}

export class AgentNodeExecutor implements WorkflowNodeExecutor {
  constructor(private readonly adapter: AgentExecutionAdapter) {}

  async execute(
    node: WorkflowNode,
    context: WorkflowExecutionContext
  ): Promise<unknown> {
    const configuredPrompt =
      typeof node.config?.prompt === 'string'
        ? node.config.prompt
        : typeof node.config?.instruction === 'string'
          ? node.config.instruction
          : undefined;

    const prompt = (configuredPrompt ?? context.prompt ?? '').trim();

    if (!prompt) {
      throw new Error(`Agent node "${node.id}" requires a prompt`);
    }

    const enrichedContext: WorkflowExecutionContext = {
      ...context,
      metadata: {
        ...(context.metadata ?? {}),
        workflowNodeId: node.id,
        workflowNodeType: node.type,
      },
    };

    return this.adapter.execute(prompt, node, enrichedContext);
  }
}

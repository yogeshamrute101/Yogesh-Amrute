import {
  WorkflowNode,
  WorkflowNodeExecutor,
  WorkflowExecutionContext,
} from './WorkflowEngine';

export interface ToolExecutionAdapter {
  execute(
    toolName: string,
    input: unknown,
    context: WorkflowExecutionContext
  ): Promise<unknown>;
}

export class ToolNodeExecutor implements WorkflowNodeExecutor {
  constructor(private readonly adapter?: ToolExecutionAdapter) {}

  async execute(
    node: WorkflowNode,
    context: WorkflowExecutionContext
  ): Promise<unknown> {
    const toolName =
      typeof node.config?.toolName === 'string'
        ? node.config.toolName.trim()
        : '';

    if (!toolName) {
      throw new Error(`Tool node "${node.id}" requires config.toolName`);
    }

    if (!this.adapter) {
      throw new Error(
        `Tool "${toolName}" cannot execute: no ToolBus adapter is connected`
      );
    }

    const input =
      node.config && 'input' in node.config
        ? node.config.input
        : context.previousOutput;

    const enrichedContext: WorkflowExecutionContext = {
      ...context,
      metadata: {
        ...(context.metadata ?? {}),
        workflowNodeId: node.id,
        workflowNodeType: node.type,
        toolName,
      },
    };

    return this.adapter.execute(toolName, input, enrichedContext);
  }
}

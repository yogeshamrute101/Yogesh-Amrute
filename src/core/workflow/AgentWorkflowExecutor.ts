import {
  WorkflowNode,
  WorkflowNodeExecutor,
  WorkflowExecutionContext,
} from './WorkflowEngine';

export interface AgentExecutionAdapter {
  execute(
    node: WorkflowNode,
    context: WorkflowExecutionContext
  ): Promise<unknown>;
}

export class AgentWorkflowExecutor implements WorkflowNodeExecutor {
  constructor(private readonly adapter?: AgentExecutionAdapter) {}

  async execute(
    node: WorkflowNode,
    context: WorkflowExecutionContext
  ): Promise<unknown> {
    if (!this.adapter) {
      return {
        status: 'skipped',
        reason: 'No agent execution adapter registered',
        nodeId: node.id,
      };
    }

    return this.adapter.execute(node, context);
  }
}

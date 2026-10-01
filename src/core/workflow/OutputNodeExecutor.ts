import {
  WorkflowNode,
  WorkflowNodeExecutor,
  WorkflowExecutionContext,
} from './WorkflowEngine';

export interface WorkflowOutput {
  status: 'ready';
  nodeId: string;
  value: unknown;
  prompt?: string;
}

export class OutputNodeExecutor implements WorkflowNodeExecutor {
  async execute(
    node: WorkflowNode,
    context: WorkflowExecutionContext
  ): Promise<WorkflowOutput> {
    return {
      status: 'ready',
      nodeId: node.id,
      value: context.previousOutput,
      prompt: context.prompt,
    };
  }
}

import type { AgentWorkflow } from './WorkflowTypes';
import { getAgent } from '../agents/AgentRegistry';

export interface WorkflowExecutionResult {
  workflowId: string;
  status: 'completed' | 'failed';
  executedNodes: string[];
  error?: string;
}

export async function executeWorkflow(
  workflow: AgentWorkflow,
): Promise<WorkflowExecutionResult> {
  const executedNodes: string[] = [];

  try {
    for (const node of workflow.nodes) {
      if (node.type === 'agent') {
        const agentId = String(node.config?.agentId ?? '');
        if (!getAgent(agentId)) {
          throw new Error(`Agent not registered: ${agentId}`);
        }
      }

      executedNodes.push(node.id);
    }

    return {
      workflowId: workflow.id,
      status: 'completed',
      executedNodes,
    };
  } catch (error) {
    return {
      workflowId: workflow.id,
      status: 'failed',
      executedNodes,
      error: error instanceof Error ? error.message : String(error),
    };
  }
}

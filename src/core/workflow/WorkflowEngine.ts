export interface WorkflowNode {
  id: string;
  type: string;
  name?: string;
  config?: Record<string, unknown>;
  [key: string]: unknown;
}

export interface WorkflowEdge {
  from: string;
  to: string;
  [key: string]: unknown;
}

export interface WorkflowDefinition {
  id?: string;
  name?: string;
  nodes: WorkflowNode[];
  edges: WorkflowEdge[];
  [key: string]: unknown;
}

export interface WorkflowExecutionContext {
  prompt?: string;
  metadata?: Record<string, unknown>;
  previousOutput?: unknown;
}

export interface WorkflowNodeExecutor {
  execute(
    node: WorkflowNode,
    context: WorkflowExecutionContext
  ): Promise<unknown>;
}

export interface WorkflowExecutionResult {
  workflowId: string;
  status: 'completed' | 'failed';
  executedNodes: string[];
  output?: unknown;
  error?: string;
}

export class WorkflowEngine {
  private executors = new Map<string, WorkflowNodeExecutor>();

  registerExecutor(type: string, executor: WorkflowNodeExecutor): void {
    this.executors.set(type, executor);
  }

  async execute(
    workflow: WorkflowDefinition,
    prompt?: string,
    metadata?: Record<string, unknown>
  ): Promise<WorkflowExecutionResult> {
    const executedNodes: string[] = [];
    let previousOutput: unknown = undefined;

    try {
      const nodes = Array.isArray(workflow?.nodes) ? workflow.nodes : [];

      for (const node of nodes) {
        const executor = this.executors.get(String(node.type));

        if (!executor) {
          if (node.type === 'trigger') {
            previousOutput = {
              type: 'trigger',
              prompt: prompt ?? '',
            };
          } else if (node.type === 'output') {
            previousOutput = {
              type: 'output',
              value: previousOutput,
            };
          } else {
            throw new Error(
              `No executor registered for workflow node type: ${String(node.type)}`
            );
          }
        } else {
          previousOutput = await executor.execute(node, {
            prompt,
            metadata,
            previousOutput,
          });
        }

        executedNodes.push(String(node.id));
      }

      return {
        workflowId: String(workflow?.id ?? `workflow_${Date.now()}`),
        status: 'completed',
        executedNodes,
        output: previousOutput,
      };
    } catch (error) {
      return {
        workflowId: String(workflow?.id ?? `workflow_${Date.now()}`),
        status: 'failed',
        executedNodes,
        error: error instanceof Error ? error.message : String(error),
      };
    }
  }
}

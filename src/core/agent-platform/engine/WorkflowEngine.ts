import type {
  AgentExecution,
  AgentNode,
  AgentWorkflow,
} from '../types';

export interface NodeExecutor {
  execute(
    node: AgentNode,
    input: unknown,
    context: Record<string, unknown>
  ): Promise<unknown>;
}

export class WorkflowEngine {
  private executors = new Map<string, NodeExecutor>();

  register(type: string, executor: NodeExecutor) {
    this.executors.set(type, executor);
  }

  async execute(
    workflow: AgentWorkflow,
    input: unknown
  ): Promise<AgentExecution> {
    const execution: AgentExecution = {
      id: crypto.randomUUID(),
      workflowId: workflow.id,
      status: 'running',
      startedAt: new Date().toISOString(),
      input,
      logs: [],
    };

    try {
      let value: unknown = input;
      const context: Record<string, unknown> = {};

      const ordered = this.orderNodes(workflow);

      for (const node of ordered) {
        execution.currentNode = node.id;
        execution.logs.push(`Executing ${node.name} (${node.type})`);

        const executor = this.executors.get(node.type);

        if (!executor) {
          execution.logs.push(`No executor registered for ${node.type}`);
          continue;
        }

        value = await executor.execute(node, value, context);
        context[node.id] = value;
      }

      execution.status = 'completed';
      execution.output = value;
      execution.completedAt = new Date().toISOString();
      return execution;
    } catch (error) {
      execution.status = 'failed';
      execution.error =
        error instanceof Error ? error.message : String(error);
      execution.completedAt = new Date().toISOString();
      execution.logs.push(`ERROR: ${execution.error}`);
      return execution;
    }
  }

  private orderNodes(workflow: AgentWorkflow): AgentNode[] {
    const incoming = new Map<string, number>();

    workflow.nodes.forEach((node) => incoming.set(node.id, 0));

    workflow.edges.forEach((edge) => {
      incoming.set(edge.target, (incoming.get(edge.target) ?? 0) + 1);
    });

    const queue = workflow.nodes.filter(
      (node) => (incoming.get(node.id) ?? 0) === 0
    );

    const result: AgentNode[] = [];

    while (queue.length) {
      const node = queue.shift()!;
      result.push(node);

      for (const edge of workflow.edges.filter(
        (item) => item.source === node.id
      )) {
        const count = (incoming.get(edge.target) ?? 0) - 1;
        incoming.set(edge.target, count);

        if (count === 0) {
          const next = workflow.nodes.find(
            (item) => item.id === edge.target
          );

          if (next) queue.push(next);
        }
      }
    }

    return result.length === workflow.nodes.length
      ? result
      : workflow.nodes;
  }
}

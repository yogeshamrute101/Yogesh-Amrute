import { WorkflowEngine } from './WorkflowEngine';
import type { AgentNode, AgentWorkflow } from '../types';

export class AgentRuntime {
  readonly engine = new WorkflowEngine();

  constructor() {
    this.registerDefaults();
  }

  private registerDefaults() {
    this.engine.register('trigger', {
      async execute(_node, input) {
        return input;
      },
    });

    this.engine.register('transform', {
      async execute(node, input) {
        return {
          input,
          transform: node.config,
        };
      },
    });

    this.engine.register('condition', {
      async execute(node, input) {
        return {
          input,
          condition: node.config,
        };
      },
    });

    this.engine.register('memory', {
      async execute(node, input, context) {
        context.memory = {
          ...(context.memory as Record<string, unknown> | undefined),
          [node.id]: input,
        };

        return input;
      },
    });

    this.engine.register('output', {
      async execute(_node, input) {
        return input;
      },
    });
  }

  registerNode(type: string, executor: {
    execute(
      node: AgentNode,
      input: unknown,
      context: Record<string, unknown>
    ): Promise<unknown>;
  }) {
    this.engine.register(type, executor);
  }

  execute(workflow: AgentWorkflow, input: unknown) {
    return this.engine.execute(workflow, input);
  }
}

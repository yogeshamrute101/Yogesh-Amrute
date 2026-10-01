import { getWorkflowIntegrationStatus, type WorkflowIntegrationStatus } from './WorkflowIntegrationStatus.js';

export interface WorkflowAdapter {
  execute: (input: unknown) => Promise<unknown>;
}

export interface WorkflowRuntimeOptions {
  agentAdapter?: WorkflowAdapter;
  toolAdapter?: WorkflowAdapter;
}

export class WorkflowRuntime {
  private agentAdapter?: WorkflowAdapter;
  private toolAdapter?: WorkflowAdapter;

  constructor(options: WorkflowRuntimeOptions) {
    this.agentAdapter = options.agentAdapter;
    this.toolAdapter = options.toolAdapter;
  }

  getStatus(): WorkflowIntegrationStatus {
    return getWorkflowIntegrationStatus({
      agentAdapter: this.agentAdapter,
      toolAdapter: this.toolAdapter,
    });
  }

  async run(input: unknown) {
    const status = this.getStatus();
    if (!status.ready) {
      throw new Error(
        `Workflow not ready - agent: ${status.agent.connected}, toolBus: ${status.toolBus.connected}`
      );
    }
    const agentResult = await this.agentAdapter!.execute(input);
    const toolResult = await this.toolAdapter!.execute(agentResult);
    return toolResult;
  }
}

// YE MISSING THA - isiliye error aa raha tha
export function createWorkflowRuntime(options: WorkflowRuntimeOptions) {
  return new WorkflowRuntime(options);
}

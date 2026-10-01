import { createWorkflowRuntime } from '../workflow/WorkflowRuntime.js';
import { AgentAdapter } from '../workflow/adapters/AgentAdapter.js';
import { ToolBusAdapter } from '../workflow/adapters/ToolBusAdapter.js';

export class VidoAIAgent {
  private runtime = createWorkflowRuntime({
    agentAdapter: new AgentAdapter(),
    toolAdapter: new ToolBusAdapter(),
  });

  getStatus() {
    return this.runtime.getStatus();
  }

  async process(task: unknown) {
    if (!this.runtime.getStatus().ready) {
      throw new Error('Workflow runtime not ready');
    }
    return this.runtime.run(task);
  }
}

// Singleton export for easy use
export const vidoAgent = new VidoAIAgent();

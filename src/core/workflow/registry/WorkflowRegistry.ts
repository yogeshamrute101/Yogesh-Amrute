import { WorkflowRuntime, type WorkflowRuntimeOptions } from '../WorkflowRuntime.js';

export interface RegisteredWorkflow {
  id: string;
  name: string;
  runtime: WorkflowRuntime;
}

class Registry {
  private workflows = new Map<string, RegisteredWorkflow>();

  register(id: string, name: string, options: WorkflowRuntimeOptions) {
    const runtime = new WorkflowRuntime(options);
    const entry: RegisteredWorkflow = { id, name, runtime };
    this.workflows.set(id, entry);
    console.log(`[Registry] Registered: ${id} - ${name} | ready: ${runtime.getStatus().ready}`);
    return entry;
  }

  get(id: string) {
    return this.workflows.get(id);
  }

  getAllStatus() {
    return Array.from(this.workflows.values()).map(w => ({
      id: w.id,
      name: w.name,
      ...w.runtime.getStatus(),
    }));
  }

  async run(id: string, input: unknown) {
    const wf = this.workflows.get(id);
    if (!wf) throw new Error(`Workflow ${id} not found`);
    return wf.runtime.run(input);
  }
}

export const workflowRegistry = new Registry();

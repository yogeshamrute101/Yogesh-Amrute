import type { AgentWorkflow } from '../types';

const KEY = 'vidoai.agent.workflows';

export class WorkflowStore {
  list(): AgentWorkflow[] {
    try {
      return JSON.parse(localStorage.getItem(KEY) || '[]');
    } catch {
      return [];
    }
  }

  get(id: string) {
    return this.list().find((workflow) => workflow.id === id);
  }

  save(workflow: AgentWorkflow) {
    const workflows = this.list().filter(
      (item) => item.id !== workflow.id
    );

    workflows.push({
      ...workflow,
      updatedAt: new Date().toISOString(),
    });

    localStorage.setItem(KEY, JSON.stringify(workflows));
    return workflow;
  }

  delete(id: string) {
    const workflows = this.list().filter(
      (workflow) => workflow.id !== id
    );

    localStorage.setItem(KEY, JSON.stringify(workflows));
  }
}

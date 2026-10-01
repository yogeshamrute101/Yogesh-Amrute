import { workflowRegistry } from './registry/WorkflowRegistry.js';

export function getWorkflowHealth() {
  const workflows = workflowRegistry.getAllStatus();
  const allReady = workflows.every((w: any) => w.ready);
  return {
    status: allReady ? 'ok' : 'degraded',
    ready: allReady,
    timestamp: new Date().toISOString(),
    workflows,
  };
}

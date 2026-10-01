import { workflowRegistry } from '../registry/WorkflowRegistry.js';
import { AgentAdapter } from '../adapters/AgentAdapter.js';
import { ToolBusAdapter } from '../adapters/ToolBusAdapter.js';

export function initVideoWorkflows() {
  workflowRegistry.register('video-gen', 'Video Generation', {
    agentAdapter: new AgentAdapter(),
    toolAdapter: new ToolBusAdapter(),
  });
  workflowRegistry.register('video-enhance', 'Video Enhance', {
    agentAdapter: new AgentAdapter(),
    toolAdapter: new ToolBusAdapter(),
  });
  workflowRegistry.register('video-thumb', 'Thumbnail Gen', {
    agentAdapter: new AgentAdapter(),
    toolAdapter: new ToolBusAdapter(),
  });
}

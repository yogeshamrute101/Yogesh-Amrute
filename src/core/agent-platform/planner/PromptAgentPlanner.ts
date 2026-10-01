import type { AgentWorkflow } from '../types';

export class PromptAgentPlanner {
  createWorkflow(prompt: string): AgentWorkflow {
    const now = new Date().toISOString();

    return {
      id: crypto.randomUUID(),
      name: 'AI Generated Workflow',
      description: prompt,
      version: 1,
      createdAt: now,
      updatedAt: now,
      variables: { prompt },
      nodes: [
        {
          id: 'trigger-1',
          type: 'trigger',
          name: 'User Request',
          config: { prompt },
          position: { x: 80, y: 180 },
        },
        {
          id: 'agent-1',
          type: 'agent',
          name: 'AI Agent',
          config: { instruction: prompt },
          position: { x: 320, y: 180 },
        },
        {
          id: 'output-1',
          type: 'output',
          name: 'Result',
          config: {},
          position: { x: 600, y: 180 },
        },
      ],
      edges: [
        {
          id: 'edge-1',
          source: 'trigger-1',
          target: 'agent-1',
        },
        {
          id: 'edge-2',
          source: 'agent-1',
          target: 'output-1',
        },
      ],
    };
  }
}

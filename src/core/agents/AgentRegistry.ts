import type { AgentDefinition } from './AgentTypes';

const agents: AgentDefinition[] = [
  {
    id: 'master-agent',
    name: 'Master Agent',
    description: 'Coordinates multi-step VidoAI tasks.',
    capabilities: ['research', 'script', 'video', 'voice', 'editor', 'qa'],
    enabled: true,
  },
  {
    id: 'research-agent',
    name: 'Research Agent',
    description: 'Researches and structures source information.',
    capabilities: ['research'],
    enabled: true,
  },
  {
    id: 'video-agent',
    name: 'Video Agent',
    description: 'Coordinates video-generation workflows.',
    capabilities: ['script', 'video'],
    enabled: true,
  },
  {
    id: 'voice-agent',
    name: 'Voice Agent',
    description: 'Coordinates narration and voice workflows.',
    capabilities: ['voice'],
    enabled: true,
  },
  {
    id: 'editor-agent',
    name: 'Editor Agent',
    description: 'Coordinates timeline, captions, audio and effects.',
    capabilities: ['editor', 'captions', 'audio', 'effects'],
    enabled: true,
  },
  {
    id: 'qa-agent',
    name: 'QA Agent',
    description: 'Validates workflow outputs before export.',
    capabilities: ['qa', 'export'],
    enabled: true,
  },
];

export function listAgents(): AgentDefinition[] {
  return agents.map((agent) => ({ ...agent, capabilities: [...agent.capabilities] }));
}

export function getAgent(id: string): AgentDefinition | undefined {
  return agents.find((agent) => agent.id === id);
}

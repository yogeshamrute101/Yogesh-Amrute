export type AgentCapability =
  | 'research'
  | 'script'
  | 'video'
  | 'voice'
  | 'editor'
  | 'captions'
  | 'audio'
  | 'effects'
  | 'export'
  | 'qa';

export interface AgentDefinition {
  id: string;
  name: string;
  description: string;
  capabilities: AgentCapability[];
  enabled: boolean;
}

export interface AgentTask {
  id: string;
  agentId: string;
  goal: string;
  input?: Record<string, unknown>;
  status: 'queued' | 'running' | 'completed' | 'failed';
  output?: unknown;
  error?: string;
  createdAt: number;
  updatedAt: number;
}

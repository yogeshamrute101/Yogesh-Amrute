export type AgentNodeType =
  | 'trigger'
  | 'agent'
  | 'llm'
  | 'research'
  | 'http'
  | 'file'
  | 'transform'
  | 'condition'
  | 'loop'
  | 'memory'
  | 'approval'
  | 'video'
  | 'captions'
  | 'audio'
  | 'timeline'
  | 'export'
  | 'output';

export interface AgentNode {
  id: string;
  type: AgentNodeType;
  name: string;
  config: Record<string, unknown>;
  position: { x: number; y: number };
}

export interface AgentEdge {
  id: string;
  source: string;
  target: string;
  condition?: string;
}

export interface AgentWorkflow {
  id: string;
  name: string;
  description?: string;
  nodes: AgentNode[];
  edges: AgentEdge[];
  variables: Record<string, unknown>;
  version: number;
  createdAt: string;
  updatedAt: string;
}

export interface AgentExecution {
  id: string;
  workflowId: string;
  status: 'queued' | 'running' | 'completed' | 'failed' | 'recovered';
  currentNode?: string;
  startedAt: string;
  completedAt?: string;
  input: unknown;
  output?: unknown;
  error?: string;
  logs: string[];
}

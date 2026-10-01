export type AgentStatus = "available" | "busy" | "disabled";

export type AgentTaskContext = {
  taskId: string;
  prompt: string;
  goal?: string;
  capabilities?: string[];
  metadata?: Record<string, unknown>;
};

export type AgentExecutionResult = {
  success: boolean;
  agentId: string;
  output?: unknown;
  error?: string;
};

export interface TeamAgent {
  id: string;
  name: string;
  capabilities: string[];
  status: AgentStatus;
  execute(context: AgentTaskContext): Promise<AgentExecutionResult>;
}

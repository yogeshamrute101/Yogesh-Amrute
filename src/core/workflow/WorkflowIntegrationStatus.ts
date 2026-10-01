export interface WorkflowIntegrationStatus {
  agent: {
    connected: boolean;
  };
  toolBus: {
    connected: boolean;
  };
  ready: boolean;
}

export function getWorkflowIntegrationStatus(options: {
  agentAdapter?: unknown;
  toolAdapter?: unknown;
}): WorkflowIntegrationStatus {
  const agentConnected =
    !!options?.agentAdapter &&
    typeof (options.agentAdapter as { execute?: unknown }).execute === 'function';

  const toolConnected =
    !!options?.toolAdapter &&
    typeof (options.toolAdapter as { execute?: unknown }).execute === 'function';

  return {
    agent: {
      connected: agentConnected,
    },
    toolBus: {
      connected: toolConnected,
    },
    ready: agentConnected && toolConnected,
  };
}

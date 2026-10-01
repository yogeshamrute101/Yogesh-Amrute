import { agentRegistry } from "./AgentRegistry";
import type {
  AgentExecutionResult,
  AgentTaskContext,
} from "./AgentTypes";

export class TeamOrchestrator {
  async delegate(
    context: AgentTaskContext,
    capability: string,
  ): Promise<AgentExecutionResult> {
    const agents = agentRegistry.findByCapability(capability);

    if (agents.length === 0) {
      return {
        success: false,
        agentId: "team-orchestrator",
        error: `No available agent for capability: ${capability}`,
      };
    }

    const agent = agents[0];

    return agent.execute(context);
  }

  capabilities(): string[] {
    return [
      ...new Set(
        agentRegistry
          .list()
          .flatMap((agent) => agent.capabilities),
      ),
    ];
  }
}

export const teamOrchestrator = new TeamOrchestrator();

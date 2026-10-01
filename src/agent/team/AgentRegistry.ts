import type { TeamAgent } from "./AgentTypes";

export class AgentRegistry {
  private readonly agents = new Map<string, TeamAgent>();

  register(agent: TeamAgent): void {
    this.agents.set(agent.id, agent);
  }

  get(id: string): TeamAgent | undefined {
    return this.agents.get(id);
  }

  list(): TeamAgent[] {
    return [...this.agents.values()];
  }

  findByCapability(capability: string): TeamAgent[] {
    return this.list().filter(
      (agent) =>
        agent.status === "available" &&
        agent.capabilities.includes(capability),
    );
  }
}

export const agentRegistry = new AgentRegistry();

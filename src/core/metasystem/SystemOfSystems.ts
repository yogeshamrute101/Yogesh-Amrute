export interface Subsystem {
  id: string;
  type: string;
  capabilities: string[];
  dependencies: string[];
}

export class SystemOfSystems {
  private systems = new Map<string, Subsystem>();

  register(system: Subsystem) {
    this.systems.set(system.id, system);
    return system;
  }

  relationshipGraph() {
    return [...this.systems.values()].map(system => ({
      system: system.id,
      dependencies: system.dependencies,
      capabilities: system.capabilities,
    }));
  }

  findCapability(capability: string) {
    return [...this.systems.values()].filter(system =>
      system.capabilities.includes(capability)
    );
  }
}

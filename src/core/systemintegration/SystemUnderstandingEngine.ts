import type { ExternalSystem } from "./ExternalSystemRegistry";
import type { SystemRelationship } from "./SystemRelationshipGraph";

export interface SystemUnderstanding {
  systemId: string;
  identity: string;
  type: string;
  capabilities: string[];
  state: string;
  relationships: SystemRelationship[];
  unknowns: string[];
}

export class SystemUnderstandingEngine {
  understand(
    system: ExternalSystem,
    relationships: SystemRelationship[]
  ): SystemUnderstanding {
    return {
      systemId: system.id,
      identity: system.name,
      type: system.type,
      capabilities: [...system.capabilities],
      state: system.status,
      relationships,
      unknowns: system.capabilities.length
        ? []
        : ["Capabilities have not been discovered."]
    };
  }
}

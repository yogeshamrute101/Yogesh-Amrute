import { ExternalSystemRegistry } from "./ExternalSystemRegistry";
import { SystemRelationshipGraph } from "./SystemRelationshipGraph";
import { SystemUnderstandingEngine } from "./SystemUnderstandingEngine";
import { CorrelationEngine } from "./CorrelationEngine";

export class UniversalIntegrationCenter {
  readonly registry = new ExternalSystemRegistry();
  readonly relationships = new SystemRelationshipGraph();
  readonly understanding = new SystemUnderstandingEngine();
  readonly correlation = new CorrelationEngine();

  inspect(systemId: string) {
    const system = this.registry.get(systemId);

    if (!system) {
      throw new Error(`External system not registered: ${systemId}`);
    }

    return this.understanding.understand(
      system,
      this.relationships.relatedTo(systemId)
    );
  }

  addRelationship(
    from: string,
    to: string,
    type:
      | "DEPENDS_ON"
      | "PROVIDES"
      | "CONSUMES"
      | "CONNECTS_TO"
      | "SYNCHRONIZES_WITH"
      | "CONTROLS"
      | "REPORTS_TO"
      | "SHARES_DATA_WITH"
      | "RELATED_TO",
    confidence = 0.5,
    evidence?: string
  ): void {
    this.relationships.add({
      from,
      to,
      type,
      confidence,
      evidence
    });
  }
}

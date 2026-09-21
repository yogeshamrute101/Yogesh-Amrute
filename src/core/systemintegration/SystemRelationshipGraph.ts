export type RelationshipType =
  | "DEPENDS_ON"
  | "PROVIDES"
  | "CONSUMES"
  | "CONNECTS_TO"
  | "SYNCHRONIZES_WITH"
  | "CONTROLS"
  | "REPORTS_TO"
  | "SHARES_DATA_WITH"
  | "RELATED_TO";

export interface SystemRelationship {
  from: string;
  to: string;
  type: RelationshipType;
  confidence: number;
  evidence?: string;
}

export class SystemRelationshipGraph {
  private relationships: SystemRelationship[] = [];

  add(relationship: SystemRelationship): void {
    const exists = this.relationships.some(
      r =>
        r.from === relationship.from &&
        r.to === relationship.to &&
        r.type === relationship.type
    );

    if (!exists) this.relationships.push(relationship);
  }

  list(): SystemRelationship[] {
    return [...this.relationships];
  }

  relatedTo(systemId: string): SystemRelationship[] {
    return this.relationships.filter(
      r => r.from === systemId || r.to === systemId
    );
  }
}

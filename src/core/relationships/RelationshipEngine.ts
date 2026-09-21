export type RelationshipType =
  | "COLLABORATES_WITH"
  | "DEPENDS_ON"
  | "SUPPORTS"
  | "COMMUNICATES_WITH"
  | "TRUSTS"
  | "REVIEWS"
  | "APPROVES"
  | "RELATED_TO";

export interface Relationship {
  from: string;
  to: string;
  type: RelationshipType;
  strength?: number;
  evidenceIds?: string[];
  createdAt: string;
}

export class RelationshipEngine {
  private relationships: Relationship[] = [];

  add(relationship: Relationship) {
    this.relationships.push({ ...relationship });
    return relationship;
  }

  find(entityId: string) {
    return this.relationships.filter(
      x => x.from === entityId || x.to === entityId
    );
  }

  all() {
    return [...this.relationships];
  }
}

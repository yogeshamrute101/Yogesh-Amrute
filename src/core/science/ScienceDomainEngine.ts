export type ScienceDomain =
  | "PHYSICS" | "CHEMISTRY" | "MATHEMATICS"
  | "BIOLOGY" | "EARTH_SCIENCE" | "ASTRONOMY"
  | "MATERIALS" | "ENVIRONMENTAL";

export interface ScientificConcept {
  domain: ScienceDomain;
  name: string;
  symbols?: string[];
  units?: string[];
  equations?: string[];
  evidenceIds?: string[];
}

export class ScienceDomainEngine {
  register(concept: ScientificConcept) {
    return {
      ...concept,
      verified: false,
      requiresEvidence: true,
    };
  }
}

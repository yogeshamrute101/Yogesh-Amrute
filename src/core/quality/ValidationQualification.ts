export type ValidationStage =
  | "URS" | "DQ" | "IQ" | "OQ" | "PQ"
  | "PROCESS_VALIDATION" | "CLEANING_VALIDATION"
  | "COMPUTER_SYSTEM_VALIDATION" | "CONTINUOUS_VERIFICATION";

export interface ValidationRequirement {
  id: string;
  stage: ValidationStage;
  requirement: string;
  acceptanceCriteria: string[];
}

export interface ValidationEvidence {
  id: string;
  requirementId: string;
  result: "PASS" | "FAIL" | "INCONCLUSIVE";
  evidence: string;
  verifiedBy?: string;
  verifiedAt?: string;
}

export class ValidationQualificationEngine {
  private requirements = new Map<string, ValidationRequirement>();
  private evidence = new Map<string, ValidationEvidence>();

  addRequirement(item: ValidationRequirement) {
    this.requirements.set(item.id, { ...item });
    return item;
  }

  recordEvidence(item: ValidationEvidence) {
    this.evidence.set(item.id, { ...item });
    return item;
  }

  evaluate(requirementId: string) {
    const requirement = this.requirements.get(requirementId);
    if (!requirement) throw new Error(`Requirement not found: ${requirementId}`);

    const evidence = [...this.evidence.values()]
      .filter(x => x.requirementId === requirementId);

    return {
      requirement,
      evidence,
      qualified: evidence.length > 0 && evidence.every(x => x.result === "PASS"),
    };
  }
}

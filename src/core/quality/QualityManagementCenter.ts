export type QualityObjectType =
  | "SOP" | "PROCEDURE" | "WORK_INSTRUCTION" | "RESPONSIBILITY"
  | "ABBREVIATION" | "DEVIATION" | "DOCUMENT" | "OBSERVATION"
  | "RECORD" | "VALIDATION" | "QUALIFICATION" | "INSTALLATION"
  | "CHANGE_CONTROL" | "TRAINING" | "RISK_ASSESSMENT"
  | "CAPA" | "AUDIT" | "CALIBRATION" | "MAINTENANCE"
  | "PERIODIC_REVIEW" | "BATCH_RECORD" | "EVIDENCE";

export type QualityStatus =
  | "DRAFT" | "UNDER_REVIEW" | "APPROVED" | "EFFECTIVE"
  | "SUPERSEDED" | "CLOSED" | "REJECTED" | "DEVIATION_OPEN"
  | "DEVIATION_CLOSED" | "VALIDATED" | "QUALIFIED"
  | "NEEDS_REVIEW";

export interface QualityObject {
  id: string;
  type: QualityObjectType;
  title: string;
  version: string;
  status: QualityStatus;
  owner?: string;
  approver?: string;
  effectiveDate?: string;
  reviewDate?: string;
  references?: string[];
  evidenceIds?: string[];
  relatedIds?: string[];
  metadata?: Record<string, unknown>;
}

export interface QualityRequirement {
  id: string;
  requirement: string;
  source?: string;
  acceptanceCriteria?: string[];
  risk?: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
}

export class QualityManagementCenter {
  private objects = new Map<string, QualityObject>();
  private requirements = new Map<string, QualityRequirement>();

  register(object: QualityObject): QualityObject {
    this.objects.set(object.id, { ...object });
    return object;
  }

  addRequirement(requirement: QualityRequirement): QualityRequirement {
    this.requirements.set(requirement.id, { ...requirement });
    return requirement;
  }

  get(id: string): QualityObject | undefined {
    return this.objects.get(id);
  }

  list(type?: QualityObjectType): QualityObject[] {
    const all = [...this.objects.values()];
    return type ? all.filter(x => x.type === type) : all;
  }

  validateObject(id: string): {
    valid: boolean;
    missing: string[];
  } {
    const item = this.objects.get(id);
    if (!item) return { valid: false, missing: ["OBJECT_NOT_FOUND"] };

    const missing: string[] = [];
    if (!item.title) missing.push("TITLE");
    if (!item.version) missing.push("VERSION");
    if (!item.owner) missing.push("OWNER");
    if (!item.status) missing.push("STATUS");

    return { valid: missing.length === 0, missing };
  }
}

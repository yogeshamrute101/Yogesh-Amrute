export type MedicalDomain =
  | "ANATOMY"
  | "PHYSIOLOGY"
  | "PATHOLOGY"
  | "PHARMACOLOGY"
  | "MICROBIOLOGY"
  | "IMMUNOLOGY"
  | "GENETICS"
  | "EPIDEMIOLOGY"
  | "DIAGNOSTICS"
  | "IMAGING"
  | "LABORATORY"
  | "PREVENTION"
  | "PUBLIC_HEALTH"
  | "CLINICAL_RESEARCH"
  | "MEDICAL_DOCUMENTATION"
  | "PATIENT_EDUCATION"
  | "TRIAGE"
  | "CLINICAL_DECISION_SUPPORT";

export type MedicalRisk =
  | "LOW"
  | "MODERATE"
  | "HIGH"
  | "EMERGENCY";

export interface MedicalEvidence {
  source: string;
  type:
    | "GUIDELINE"
    | "SYSTEMATIC_REVIEW"
    | "CLINICAL_TRIAL"
    | "TEXTBOOK"
    | "PRIMARY_STUDY"
    | "MODEL_OUTPUT"
    | "USER_PROVIDED";
  confidence: number;
  timestamp: number;
}

export interface ClinicalObservation {
  id: string;
  observation: string;
  domain: MedicalDomain;
  evidence: MedicalEvidence[];
}

export interface MedicalAssessment {
  id: string;
  observations: ClinicalObservation[];
  possibleExplanations: string[];
  uncertainty: string[];
  risk: MedicalRisk;
  requiresClinicianReview: boolean;
  emergencyEscalation: boolean;
}

export interface MedicalAction {
  id: string;
  description: string;
  risk: MedicalRisk;
  requiresClinicianApproval: boolean;
  status: "PROPOSED" | "APPROVED" | "REJECTED" | "COMPLETED";
}

export class MedicalIntelligenceLayer {
  private observations = new Map<string, ClinicalObservation>();
  private assessments = new Map<string, MedicalAssessment>();
  private actions = new Map<string, MedicalAction>();

  addObservation(observation: ClinicalObservation) {
    this.observations.set(observation.id, observation);
  }

  assess(observationIds: string[]): MedicalAssessment {
    const observations = observationIds
      .map(id => this.observations.get(id))
      .filter((item): item is ClinicalObservation => Boolean(item));

    const assessment: MedicalAssessment = {
      id: `assessment-${Date.now()}`,
      observations,
      possibleExplanations: [],
      uncertainty: [
        "Assessment requires appropriate clinical context.",
        "Missing examination, history, or test data may change interpretation.",
      ],
      risk: "MODERATE",
      requiresClinicianReview: true,
      emergencyEscalation: false,
    };

    this.assessments.set(assessment.id, assessment);
    return assessment;
  }

  proposeAction(
    description: string,
    risk: MedicalRisk
  ): MedicalAction {
    const action: MedicalAction = {
      id: `medical-action-${Date.now()}`,
      description,
      risk,
      requiresClinicianApproval: true,
      status: "PROPOSED",
    };

    this.actions.set(action.id, action);
    return action;
  }

  getAssessment(id: string) {
    return this.assessments.get(id);
  }

  getObservations() {
    return [...this.observations.values()];
  }

  getActions() {
    return [...this.actions.values()];
  }
}

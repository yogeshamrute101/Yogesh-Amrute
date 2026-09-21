export type CAPAStatus =
  | "detected"
  | "diagnosed"
  | "corrective-action"
  | "preventive-action"
  | "testing"
  | "verified"
  | "closed";

export type CAPACase = {
  id: string;
  problem: string;
  rootCause?: string;
  correctiveAction?: string;
  preventiveAction?: string;
  status: CAPAStatus;
};

export class CorrectivePreventiveAction {
  create(input: CAPACase) {
    return { ...input };
  }

  advance(capa: CAPACase, status: CAPAStatus) {
    return { ...capa, status };
  }
}

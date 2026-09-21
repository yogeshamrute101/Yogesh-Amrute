export type EvolutionAction =
  | "ADD"
  | "EXTEND"
  | "REPLACE"
  | "MIGRATE"
  | "DEPRECATE"
  | "ROLLBACK";

export interface EvolutionProposal {
  id: string;
  target: string;
  action: EvolutionAction;
  reason: string;
  expectedBenefit?: string;
  risks?: string[];
  validationRequired: boolean;
  approvalRequired: boolean;
}

export class CapabilityEvolutionEngine {
  propose(proposal: EvolutionProposal) {
    return {
      ...proposal,
      status: "PROPOSED",
    };
  }
}

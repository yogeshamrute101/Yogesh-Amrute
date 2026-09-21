export type PolicyDecision = {
  action: string;
  permitted: boolean;
  reason: string;
};

export class PolicyEthicsLayer {
  evaluate(decision: PolicyDecision) {
    return decision;
  }
}

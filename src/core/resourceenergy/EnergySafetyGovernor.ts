export interface EnergyPolicy {
  maxAllocation: number;
  minimumReserve: number;
  requireApprovalAbove: number;
}

export interface EnergyDecision {
  allowed: boolean;
  requiresApproval: boolean;
  reason: string;
}

export class EnergySafetyGovernor {
  decide(
    requested: number,
    available: number,
    policy: EnergyPolicy
  ): EnergyDecision {
    if (requested <= 0) {
      return {
        allowed: false,
        requiresApproval: false,
        reason: "Requested amount must be positive."
      };
    }

    if (requested > policy.maxAllocation) {
      return {
        allowed: false,
        requiresApproval: true,
        reason: "Request exceeds configured maximum allocation."
      };
    }

    if (available - requested < policy.minimumReserve) {
      return {
        allowed: false,
        requiresApproval: true,
        reason: "Minimum reserve would be violated."
      };
    }

    return {
      allowed: true,
      requiresApproval: requested > policy.requireApprovalAbove,
      reason: "Resource allocation passed configured safety limits."
    };
  }
}

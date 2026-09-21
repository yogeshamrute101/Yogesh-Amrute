export type RiskLevel = "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";

export interface CapabilityAccessRequest {
  capability: string;
  risk: RiskLevel;
  accessKey?: string;
  approvedByUser?: boolean;
}

export interface AccessDecision {
  allowed: boolean;
  reason: string;
  requiresApproval: boolean;
  audited: boolean;
}

export class RestrictedCapabilityAccess {
  private readonly protectedCapabilities = new Set([
    "WEAPON_SYSTEMS",
    "EXPLOSIVES",
    "HARMFUL_CHEMICALS",
    "BIOLOGICAL_HAZARDS",
    "HIGH_IMPACT_PHYSICAL_CONTROL",
    "CRITICAL_INFRASTRUCTURE_CONTROL",
    "AUTONOMOUS_HAZARDOUS_ACTION",
  ]);

  private readonly configuredKey =
    process.env.VIDOAI_OWNER_KEY ?? "";

  authorize(request: CapabilityAccessRequest): AccessDecision {
    const protectedCapability =
      this.protectedCapabilities.has(request.capability);

    if (!protectedCapability) {
      return {
        allowed: true,
        reason: "Capability is not in the protected high-risk set.",
        requiresApproval: request.risk === "HIGH",
        audited: true,
      };
    }

    if (!this.configuredKey) {
      return {
        allowed: false,
        reason: "Protected capabilities are locked: owner authorization is not configured.",
        requiresApproval: true,
        audited: true,
      };
    }

    if (
      !request.accessKey ||
      request.accessKey !== this.configuredKey
    ) {
      return {
        allowed: false,
        reason: "Owner authorization required.",
        requiresApproval: true,
        audited: true,
      };
    }

    if (!request.approvedByUser) {
      return {
        allowed: false,
        reason: "Explicit user approval is required for protected actions.",
        requiresApproval: true,
        audited: true,
      };
    }

    return {
      allowed: false,
      reason:
        "Protected harmful capabilities remain blocked even with owner authorization.",
      requiresApproval: true,
      audited: true,
    };
  }
}

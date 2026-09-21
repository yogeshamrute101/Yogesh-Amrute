export type ControlLevel =
  | "OBSERVE"
  | "SUGGEST"
  | "REQUEST"
  | "EXECUTE"
  | "ADMIN";

export type ResourceType =
  | "CPU"
  | "MEMORY"
  | "STORAGE"
  | "NETWORK"
  | "API"
  | "DEVICE"
  | "ROBOT"
  | "DATABASE"
  | "APPLICATION"
  | "USER_DATA";

export type ControlDecision =
  | "ALLOW"
  | "DENY"
  | "APPROVAL_REQUIRED"
  | "LIMIT"
  | "SAFE_MODE";

export interface CapabilityPolicy {
  capability: string;
  level: ControlLevel;
  enabled: boolean;
  requiresApproval: boolean;
  allowedResources: ResourceType[];
  limits?: Record<string, number>;
}

export interface UsageRequest {
  id: string;
  capability: string;
  resource: ResourceType;
  operation: string;
  amount?: number;
  purpose: string;
}

export interface ControlResult {
  requestId: string;
  decision: ControlDecision;
  reason: string;
  timestamp: number;
}

export class CapabilityControl {
  private policies = new Map<string, CapabilityPolicy>();
  private usage = new Map<string, number>();
  private history: ControlResult[] = [];

  registerPolicy(policy: CapabilityPolicy): void {
    this.policies.set(policy.capability, policy);
  }

  evaluate(request: UsageRequest): ControlResult {
    const policy = this.policies.get(request.capability);

    if (!policy || !policy.enabled) {
      return this.record({
        requestId: request.id,
        decision: "DENY",
        reason: "Capability is unavailable or disabled.",
        timestamp: Date.now(),
      });
    }

    if (!policy.allowedResources.includes(request.resource)) {
      return this.record({
        requestId: request.id,
        decision: "DENY",
        reason: "Resource is outside the capability policy.",
        timestamp: Date.now(),
      });
    }

    if (policy.requiresApproval) {
      return this.record({
        requestId: request.id,
        decision: "APPROVAL_REQUIRED",
        reason: "Explicit authorization is required.",
        timestamp: Date.now(),
      });
    }

    const current = this.usage.get(request.resource) ?? 0;
    const limit = policy.limits?.[request.resource];

    if (
      typeof limit === "number" &&
      typeof request.amount === "number" &&
      current + request.amount > limit
    ) {
      return this.record({
        requestId: request.id,
        decision: "LIMIT",
        reason: "Resource usage limit would be exceeded.",
        timestamp: Date.now(),
      });
    }

    return this.record({
      requestId: request.id,
      decision: "ALLOW",
      reason: "Capability and resource policy passed.",
      timestamp: Date.now(),
    });
  }

  recordUsage(resource: ResourceType, amount: number): void {
    const current = this.usage.get(resource) ?? 0;
    this.usage.set(resource, Math.max(0, current + amount));
  }

  releaseUsage(resource: ResourceType, amount: number): void {
    const current = this.usage.get(resource) ?? 0;
    this.usage.set(resource, Math.max(0, current - amount));
  }

  emergencySafeMode(): void {
    for (const policy of this.policies.values()) {
      policy.enabled = false;
    }
  }

  enableCapability(capability: string): boolean {
    const policy = this.policies.get(capability);
    if (!policy) return false;
    policy.enabled = true;
    return true;
  }

  disableCapability(capability: string): boolean {
    const policy = this.policies.get(capability);
    if (!policy) return false;
    policy.enabled = false;
    return true;
  }

  getPolicies(): CapabilityPolicy[] {
    return [...this.policies.values()];
  }

  getUsage(): Record<string, number> {
    return Object.fromEntries(this.usage.entries());
  }

  private record(result: ControlResult): ControlResult {
    this.history.push(result);
    this.history = this.history.slice(-1000);
    return result;
  }

  getHistory(): ControlResult[] {
    return [...this.history];
  }
}

export const capabilityControl = new CapabilityControl();

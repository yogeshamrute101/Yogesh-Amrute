import {
  ExternalResourceRegistry
} from "./ExternalResourceRegistry";
import {
  ResourceEnergyAllocator
} from "./ResourceEnergyAllocator";
import {
  EnergySafetyGovernor
} from "./EnergySafetyGovernor";

export class ResourceEnergyCenter {
  readonly registry = new ExternalResourceRegistry();
  readonly allocator = new ResourceEnergyAllocator();
  readonly governor = new EnergySafetyGovernor();

  requestResource(
    requester: string,
    type: Parameters<ExternalResourceRegistry["available"]>[0],
    amount: number,
    unit: string,
    priority = 0,
    reason = "System resource request"
  ) {
    const resources = this.registry.available(type);

    const totalAvailable = resources.reduce(
      (sum, resource) => sum + resource.available,
      0
    );

    const decision = this.governor.decide(
      amount,
      totalAvailable,
      {
        maxAllocation: Math.max(amount, 1),
        minimumReserve: 0,
        requireApprovalAbove: Number.MAX_SAFE_INTEGER
      }
    );

    if (!decision.allowed) {
      return {
        approved: false,
        decision,
        allocations: []
      };
    }

    const allocations = this.allocator.allocate(
      {
        requester,
        type,
        amount,
        unit,
        priority,
        reason
      },
      resources
    );

    return {
      approved: allocations.every(x => x.approved),
      decision,
      allocations
    };
  }
}

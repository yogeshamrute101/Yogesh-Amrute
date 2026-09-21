import type {
  ExternalResource,
  ResourceType
} from "./ExternalResourceRegistry";

export interface ResourceRequest {
  requester: string;
  type: ResourceType;
  amount: number;
  unit: string;
  priority: number;
  reason: string;
}

export interface Allocation {
  resourceId: string;
  requester: string;
  amount: number;
  unit: string;
  approved: boolean;
  reason: string;
}

export class ResourceEnergyAllocator {
  allocate(
    request: ResourceRequest,
    resources: ExternalResource[]
  ): Allocation[] {
    const candidates = resources
      .filter(
        resource =>
          resource.type === request.type &&
          resource.online &&
          resource.authorized &&
          resource.available > 0
      )
      .sort((a, b) => b.available - a.available);

    let remaining = request.amount;
    const allocations: Allocation[] = [];

    for (const resource of candidates) {
      if (remaining <= 0) break;

      const amount = Math.min(remaining, resource.available);

      allocations.push({
        resourceId: resource.id,
        requester: request.requester,
        amount,
        unit: request.unit,
        approved: true,
        reason: request.reason
      });

      remaining -= amount;
    }

    if (remaining > 0) {
      allocations.push({
        resourceId: "UNAVAILABLE",
        requester: request.requester,
        amount: remaining,
        unit: request.unit,
        approved: false,
        reason: "Insufficient authorized resource capacity"
      });
    }

    return allocations;
  }
}

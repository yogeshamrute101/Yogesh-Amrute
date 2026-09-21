export type ResourceType =
  | "CPU"
  | "GPU"
  | "MEMORY"
  | "STORAGE"
  | "NETWORK"
  | "API"
  | "BATTERY"
  | "ELECTRICAL_ENERGY"
  | "DEVICE"
  | "ROBOT_COMPUTE"
  | "CLOUD_COMPUTE"
  | "UNKNOWN";

export interface ExternalResource {
  id: string;
  systemId: string;
  type: ResourceType;
  capacity: number;
  available: number;
  unit: string;
  online: boolean;
  authorized: boolean;
  metadata: Record<string, unknown>;
}

export class ExternalResourceRegistry {
  private resources = new Map<string, ExternalResource>();

  register(resource: ExternalResource): void {
    this.resources.set(resource.id, resource);
  }

  get(id: string): ExternalResource | undefined {
    return this.resources.get(id);
  }

  list(): ExternalResource[] {
    return [...this.resources.values()];
  }

  available(type?: ResourceType): ExternalResource[] {
    return this.list().filter(
      resource =>
        resource.online &&
        resource.authorized &&
        resource.available > 0 &&
        (!type || resource.type === type)
    );
  }
}

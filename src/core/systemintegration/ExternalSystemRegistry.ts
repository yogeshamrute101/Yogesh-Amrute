export type ExternalSystemType =
  | "MOBILE_APP"
  | "WEB_APP"
  | "DESKTOP_APP"
  | "API"
  | "DATABASE"
  | "CLOUD"
  | "DEVICE"
  | "ROBOT"
  | "SERVICE"
  | "UNKNOWN";

export interface ExternalSystem {
  id: string;
  name: string;
  type: ExternalSystemType;
  endpoint?: string;
  capabilities: string[];
  status: "UNKNOWN" | "ONLINE" | "OFFLINE" | "DEGRADED";
  authenticated: boolean;
  authorized: boolean;
  metadata: Record<string, unknown>;
}

export class ExternalSystemRegistry {
  private systems = new Map<string, ExternalSystem>();

  register(system: ExternalSystem): void {
    this.systems.set(system.id, system);
  }

  get(id: string): ExternalSystem | undefined {
    return this.systems.get(id);
  }

  list(): ExternalSystem[] {
    return [...this.systems.values()];
  }

  update(
    id: string,
    patch: Partial<ExternalSystem>
  ): ExternalSystem | undefined {
    const current = this.systems.get(id);
    if (!current) return undefined;

    const updated = {
      ...current,
      ...patch,
      id: current.id
    };

    this.systems.set(id, updated);
    return updated;
  }
}

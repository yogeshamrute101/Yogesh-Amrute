export type CapabilityStatus =
  | "missing"
  | "planned"
  | "building"
  | "integrated"
  | "testing"
  | "verified"
  | "production";

export type Capability = {
  id: string;
  name: string;
  status: CapabilityStatus;
  description?: string;
};

export class CapabilityRegistry {
  private capabilities = new Map<string, Capability>();

  register(capability: Capability) {
    this.capabilities.set(capability.id, capability);
    return capability;
  }

  update(id: string, status: CapabilityStatus) {
    const item = this.capabilities.get(id);
    if (!item) return undefined;
    item.status = status;
    return item;
  }

  list() {
    return [...this.capabilities.values()];
  }

  gaps() {
    return this.list().filter(x =>
      ["missing", "planned", "building"].includes(x.status)
    );
  }
}

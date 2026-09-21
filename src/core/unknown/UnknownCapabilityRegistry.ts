export interface UnknownCapability {
  id: string;
  observation: string;
  source?: string;
  discoveredAt: string;
  investigationStatus: "NEW" | "INVESTIGATING" | "UNDERSTOOD" | "DISMISSED";
  evidenceIds?: string[];
}

export class UnknownCapabilityRegistry {
  private items = new Map<string, UnknownCapability>();

  add(item: UnknownCapability) {
    this.items.set(item.id, { ...item });
    return item;
  }

  investigate(id: string) {
    const item = this.items.get(id);
    if (!item) throw new Error(`Unknown capability not found: ${id}`);
    item.investigationStatus = "INVESTIGATING";
    return item;
  }

  all() {
    return [...this.items.values()];
  }
}

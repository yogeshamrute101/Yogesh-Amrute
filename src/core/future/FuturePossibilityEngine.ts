export type PossibilityStatus =
  | "UNKNOWN"
  | "DISCOVERED"
  | "RESEARCHING"
  | "SIMULATING"
  | "VALIDATED"
  | "INTEGRATED"
  | "REJECTED";

export interface FuturePossibility {
  id: string;
  name: string;
  category: string;
  description: string;
  status: PossibilityStatus;
  dependencies?: string[];
  prerequisites?: string[];
  risks?: string[];
  evidenceIds?: string[];
  compatibility?: string[];
}

export class FuturePossibilityEngine {
  private possibilities = new Map<string, FuturePossibility>();

  discover(item: FuturePossibility) {
    if (!this.possibilities.has(item.id)) {
      this.possibilities.set(item.id, { ...item });
    }
    return this.possibilities.get(item.id)!;
  }

  updateStatus(id: string, status: PossibilityStatus) {
    const item = this.possibilities.get(id);
    if (!item) throw new Error(`Possibility not found: ${id}`);
    item.status = status;
    return item;
  }

  findByCategory(category: string) {
    return [...this.possibilities.values()]
      .filter(x => x.category === category);
  }

  all() {
    return [...this.possibilities.values()];
  }
}

export type InternalWorldType =
  | "KNOWLEDGE"
  | "SCIENCE"
  | "ENGINEERING"
  | "SOFTWARE"
  | "OFFICE"
  | "CREATIVE"
  | "BUSINESS"
  | "QUALITY"
  | "RESEARCH"
  | "PROJECT"
  | "SIMULATION"
  | "HUMAN"
  | "PHYSICAL"
  | "DIGITAL"
  | "CUSTOM";

export interface InternalWorld {
  id: string;
  name: string;
  type: InternalWorldType;
  purpose: string;
  capabilities: string[];
  parentWorldId?: string;
  childWorldIds?: string[];
}

export class InternalWorldRegistry {
  private worlds = new Map<string, InternalWorld>();

  register(world: InternalWorld) {
    this.worlds.set(world.id, { ...world });
    return world;
  }

  get(id: string) {
    return this.worlds.get(id);
  }

  children(id: string) {
    return [...this.worlds.values()].filter(x => x.parentWorldId === id);
  }

  all() {
    return [...this.worlds.values()];
  }
}

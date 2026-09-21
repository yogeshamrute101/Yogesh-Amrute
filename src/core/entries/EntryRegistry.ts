export type EntryStatus =
  | "existing"
  | "new"
  | "modified"
  | "duplicate"
  | "missing"
  | "unknown"
  | "needs-review";

export type Entry = {
  id: string;
  type: string;
  name: string;
  content?: unknown;
  source?: string;
  version?: string;
  status: EntryStatus;
  createdAt: number;
  updatedAt: number;
};

export class EntryRegistry {
  private entries = new Map<string, Entry>();

  register(entry: Entry) {
    this.entries.set(entry.id, entry);
    return entry;
  }

  get(id: string) {
    return this.entries.get(id);
  }

  list() {
    return [...this.entries.values()];
  }

  byType(type: string) {
    return this.list().filter(x => x.type === type);
  }

  byStatus(status: EntryStatus) {
    return this.list().filter(x => x.status === status);
  }
}

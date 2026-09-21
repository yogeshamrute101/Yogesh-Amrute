export type MemoryRecord = {
  id: string;
  type: "fact" | "experience" | "decision" | "lesson" | "unknown";
  content: string;
  source?: string;
  confidence?: number;
  createdAt: number;
};

export class MemoryKnowledgeLayer {
  private memory = new Map<string, MemoryRecord>();

  remember(record: MemoryRecord) {
    this.memory.set(record.id, record);
    return record;
  }

  recall(id: string) {
    return this.memory.get(id);
  }

  search(query: string) {
    const q = query.toLowerCase();
    return [...this.memory.values()].filter(x =>
      x.content.toLowerCase().includes(q)
    );
  }

  all() {
    return [...this.memory.values()];
  }
}

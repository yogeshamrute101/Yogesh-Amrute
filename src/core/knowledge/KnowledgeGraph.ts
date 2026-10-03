import type {
  KnowledgeSource,
  KnowledgeChunk,
} from '../../types/knowledge/UniversalKnowledge';

export interface KnowledgeNode {
  id: string;
  label: string;
  type: 'concept' | 'person' | 'place' | 'event' | 'work' | 'technology' | 'disease' | 'other';
}

export interface KnowledgeRelation {
  from: string;
  to: string;
  relation: string;
  sourceId?: string;
}

export class KnowledgeGraph {
  private nodes = new Map<string, KnowledgeNode>();
  private relations: KnowledgeRelation[] = [];

  addSource(source: KnowledgeSource) {
    this.nodes.set(`source:${source.id}`, {
      id: `source:${source.id}`,
      label: source.title,
      type: 'work',
    });
  }

  addChunk(chunk: KnowledgeChunk) {
    for (const topic of chunk.topics) {
      const id = `concept:${topic.toLowerCase()}`;

      if (!this.nodes.has(id)) {
        this.nodes.set(id, {
          id,
          label: topic,
          type: 'concept',
        });
      }

      this.relations.push({
        from: `source:${chunk.sourceId}`,
        to: id,
        relation: 'discusses',
        sourceId: chunk.sourceId,
      });
    }
  }

  searchConcept(label: string) {
    const target = label.toLowerCase();

    return [...this.nodes.values()].filter(
      (node) => node.label.toLowerCase().includes(target),
    );
  }

  getStats() {
    return {
      nodes: this.nodes.size,
      relations: this.relations.length,
    };
  }
}

export const universalKnowledgeGraph = new KnowledgeGraph();

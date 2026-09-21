export type KnowledgeNode = {
  id: string;
  type: string;
  label: string;
};

export type KnowledgeEdge = {
  from: string;
  relation: string;
  to: string;
};

export class KnowledgeGraph {
  private nodes = new Map<string, KnowledgeNode>();
  private edges: KnowledgeEdge[] = [];

  addNode(node: KnowledgeNode) {
    this.nodes.set(node.id, node);
    return node;
  }

  connect(edge: KnowledgeEdge) {
    this.edges.push(edge);
    return edge;
  }

  getNodes() {
    return [...this.nodes.values()];
  }

  getEdges() {
    return [...this.edges];
  }
}

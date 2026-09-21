export interface TraceabilityLink {
  id: string;
  requirementId: string;
  designId?: string;
  procedureId?: string;
  implementationId?: string;
  testId?: string;
  evidenceId?: string;
  resultId?: string;
  status: "LINKED" | "MISSING" | "VERIFIED";
}

export class TraceabilityMatrix {
  private links = new Map<string, TraceabilityLink>();

  add(link: TraceabilityLink) {
    this.links.set(link.id, { ...link });
    return link;
  }

  get(id: string) {
    return this.links.get(id);
  }

  coverage() {
    const all = [...this.links.values()];
    const verified = all.filter(x => x.status === "VERIFIED").length;
    return {
      total: all.length,
      verified,
      coverage: all.length ? verified / all.length : 0,
    };
  }

  missing() {
    return [...this.links.values()].filter(x => x.status === "MISSING");
  }
}

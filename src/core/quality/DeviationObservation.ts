export type DeviationSeverity = "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";

export interface Observation {
  id: string;
  description: string;
  observedAt: string;
  observer?: string;
  evidenceIds?: string[];
  relatedProcedureId?: string;
}

export interface Deviation {
  id: string;
  title: string;
  description: string;
  severity: DeviationSeverity;
  detectedAt: string;
  status: "OPEN" | "INVESTIGATION" | "CAPA" | "CLOSED";
  observationIds?: string[];
  rootCauseId?: string;
  capaId?: string;
}

export class DeviationObservationManager {
  private observations = new Map<string, Observation>();
  private deviations = new Map<string, Deviation>();

  recordObservation(item: Observation) {
    this.observations.set(item.id, { ...item });
    return item;
  }

  openDeviation(item: Deviation) {
    this.deviations.set(item.id, { ...item });
    return item;
  }

  closeDeviation(id: string) {
    const deviation = this.deviations.get(id);
    if (!deviation) throw new Error(`Deviation not found: ${id}`);
    deviation.status = "CLOSED";
    return deviation;
  }

  getDeviation(id: string) {
    return this.deviations.get(id);
  }
}

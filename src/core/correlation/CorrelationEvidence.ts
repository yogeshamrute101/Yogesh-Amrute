export interface CorrelationEvidence {
  source: string;
  observationCount: number;
  replicationCount: number;
  consistency: number;
  recency?: number;
}

export class CorrelationEvidenceEngine {
  assess(evidence: CorrelationEvidence[]) {
    if (!evidence.length) {
      return {
        confidence: 0,
        status: "UNKNOWN",
      };
    }

    const consistency =
      evidence.reduce((sum, x) => sum + x.consistency, 0) /
      evidence.length;

    const replication =
      evidence.reduce((sum, x) => sum + x.replicationCount, 0);

    return {
      confidence: Math.min(
        1,
        consistency * 0.7 + Math.min(1, replication / 10) * 0.3
      ),
      status:
        consistency >= 0.8 && replication >= 2
          ? "SUPPORTED_PATTERN"
          : "WEAK_PATTERN",
    };
  }
}

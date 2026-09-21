export type CorrelationType =
  | "STATISTICAL"
  | "TEMPORAL"
  | "SEQUENTIAL"
  | "BEHAVIORAL"
  | "DEPENDENCY"
  | "SPATIAL"
  | "SEMANTIC"
  | "EVENT"
  | "MULTIMODAL"
  | "HISTORICAL"
  | "UNKNOWN";

export type CorrelationDirection =
  | "POSITIVE"
  | "NEGATIVE"
  | "NONE"
  | "UNKNOWN";

export interface Observation {
  id: string;
  variable: string;
  value: number;
  timestamp?: number;
  source?: string;
}

export interface CorrelationResult {
  variableA: string;
  variableB: string;
  type: CorrelationType;
  direction: CorrelationDirection;
  coefficient?: number;
  strength: "STRONG" | "MODERATE" | "WEAK" | "NONE" | "UNKNOWN";
  sampleSize: number;
  evidence: string[];
  confounders: string[];
  causalClaim: false;
  confidence: number;
}

export class UniversalCorrelationEngine {
  analyze(
    a: Observation[],
    b: Observation[],
    type: CorrelationType = "STATISTICAL"
  ): CorrelationResult {
    const pairs = Math.min(a.length, b.length);

    if (pairs < 2) {
      return {
        variableA: a[0]?.variable ?? "UNKNOWN",
        variableB: b[0]?.variable ?? "UNKNOWN",
        type,
        direction: "UNKNOWN",
        strength: "UNKNOWN",
        sampleSize: pairs,
        evidence: ["Insufficient observations."],
        confounders: [],
        causalClaim: false,
        confidence: 0,
      };
    }

    const av = a.slice(0, pairs).map(x => x.value);
    const bv = b.slice(0, pairs).map(x => x.value);

    const meanA = av.reduce((s, x) => s + x, 0) / pairs;
    const meanB = bv.reduce((s, x) => s + x, 0) / pairs;

    let numerator = 0;
    let da = 0;
    let db = 0;

    for (let i = 0; i < pairs; i++) {
      const xa = av[i] - meanA;
      const xb = bv[i] - meanB;
      numerator += xa * xb;
      da += xa * xa;
      db += xb * xb;
    }

    const denominator = Math.sqrt(da * db);
    const coefficient =
      denominator === 0 ? 0 : numerator / denominator;

    const direction: CorrelationDirection =
      coefficient > 0.05
        ? "POSITIVE"
        : coefficient < -0.05
          ? "NEGATIVE"
          : "NONE";

    const absolute = Math.abs(coefficient);

    const strength =
      absolute >= 0.7
        ? "STRONG"
        : absolute >= 0.4
          ? "MODERATE"
          : absolute >= 0.05
            ? "WEAK"
            : "NONE";

    return {
      variableA: a[0].variable,
      variableB: b[0].variable,
      type,
      direction,
      coefficient,
      strength,
      sampleSize: pairs,
      evidence: [
        `Observed ${pairs} paired observations.`,
        `Correlation coefficient estimated as ${coefficient.toFixed(4)}.`,
      ],
      confounders: [],
      causalClaim: false,
      confidence: Math.min(1, pairs / 100),
    };
  }
}

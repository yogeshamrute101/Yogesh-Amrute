export type RealityState =
  | "verified-real"
  | "simulated"
  | "predicted"
  | "hypothetical"
  | "unknown";

export type RealityAssessment = {
  statement: string;
  state: RealityState;
  evidence: string[];
};

export class RealityBoundaryLayer {
  assess(input: RealityAssessment) {
    return {
      ...input,
      actionable:
        input.state === "verified-real" &&
        input.evidence.length > 0
    };
  }
}

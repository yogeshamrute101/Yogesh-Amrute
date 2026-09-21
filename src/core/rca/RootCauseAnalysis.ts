export type CauseCandidate = {
  cause: string;
  evidence: string[];
  confidence: number;
};

export class RootCauseAnalysis {
  analyze(problem: string, candidates: CauseCandidate[]) {
    return {
      problem,
      candidates: [...candidates].sort((a, b) => b.confidence - a.confidence),
      requiresInvestigation: candidates.length === 0
    };
  }
}

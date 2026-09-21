/**
 * VidoAI EvidenceProvenance
 * Tracks evidence source, timestamp, transformation and verification status.
 *
 * Design rule:
 * This module never treats an unverified model output as established fact.
 */

export type VerificationState =
  | "VERIFIED"
  | "UNVERIFIED"
  | "INFERRED"
  | "PREDICTED"
  | "SIMULATED"
  | "HYPOTHESIS"
  | "UNKNOWN"
  | "CONFLICTING"
  | "REQUIRES_HUMAN_REVIEW";

export interface EvidenceRecord {
  id: string;
  source: string;
  claim: string;
  timestamp: number;
  reliability?: number;
  verified: boolean;
}

export interface VerificationResult {
  state: VerificationState;
  confidence: number;
  evidence: EvidenceRecord[];
  contradictions: string[];
  reasons: string[];
}

export class EvidenceProvenance {
  evaluate(input: {
    claim: string;
    evidence?: EvidenceRecord[];
    expected?: unknown;
    actual?: unknown;
  }): VerificationResult {
    const evidence = input.evidence ?? [];
    const contradictions: string[] = [];

    if (!input.claim.trim()) {
      return {
        state: "UNKNOWN",
        confidence: 0,
        evidence,
        contradictions: [],
        reasons: ["No claim was supplied."]
      };
    }

    const verifiedEvidence = evidence.filter(e => e.verified);

    if (verifiedEvidence.length === 0) {
      return {
        state: "UNVERIFIED",
        confidence: 0,
        evidence,
        contradictions,
        reasons: ["No independently verified evidence is available."]
      };
    }

    const confidence = Math.min(
      0.9999,
      verifiedEvidence.reduce(
        (sum, e) => sum + Math.max(0, Math.min(1, e.reliability ?? 0.5)),
        0
      ) / verifiedEvidence.length
    );

    return {
      state: confidence >= 0.9999 ? "VERIFIED" : "INFERRED",
      confidence,
      evidence,
      contradictions,
      reasons: [
        `${verifiedEvidence.length} verified evidence record(s) evaluated.`
      ]
    };
  }
}

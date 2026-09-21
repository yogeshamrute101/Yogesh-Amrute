/**
 * Universal VidoAI verification contract.
 *
 * All important capabilities should eventually pass through this contract.
 * This is an integration contract, not a claim that every existing module
 * is already wired to it.
 */

export type TruthState =
  | "VERIFIED"
  | "UNVERIFIED"
  | "INFERRED"
  | "PREDICTED"
  | "SIMULATED"
  | "HYPOTHESIS"
  | "UNKNOWN"
  | "CONFLICTING"
  | "REQUIRES_HUMAN_REVIEW";

export interface VerificationContext {
  operationId: string;
  input: unknown;
  expected?: unknown;
  actual?: unknown;
  evidence: Array<{
    source: string;
    claim: string;
    verified: boolean;
    reliability?: number;
  }>;
  truthState: TruthState;
  confidence: number;
  safetyChecked: boolean;
  authorizationChecked: boolean;
}

export interface VerificationPolicy {
  minimumConfidence: number;
  requireEvidence: boolean;
  requireIndependentCheck: boolean;
  requireHumanApproval: boolean;
  allowUnknown: boolean;
}

export const DEFAULT_VERIFICATION_POLICY: VerificationPolicy = {
  minimumConfidence: 0.9999,
  requireEvidence: true,
  requireIndependentCheck: true,
  requireHumanApproval: true,
  allowUnknown: false
};

export function isVerificationAcceptable(
  context: VerificationContext,
  policy: VerificationPolicy = DEFAULT_VERIFICATION_POLICY
): boolean {
  if (context.truthState === "CONFLICTING") return false;
  if (context.truthState === "UNKNOWN") return policy.allowUnknown;
  if (context.confidence < policy.minimumConfidence) return false;
  if (policy.requireEvidence && context.evidence.length === 0) return false;
  if (!context.safetyChecked) return false;
  if (!context.authorizationChecked) return false;
  return true;
}

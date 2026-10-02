export type ModelCapability =
  | "text"
  | "reasoning"
  | "vision"
  | "image"
  | "video"
  | "audio"
  | "voice"
  | "transcription"
  | "embedding";

export interface ModelRouteRequest {
  capability: ModelCapability;
  quality?: "fast" | "balanced" | "high";
  maxLatencyMs?: number;
  maxCostUnits?: number;
  providerAllowList?: string[];
}

export interface ModelRouteDecision {
  provider: string;
  model: string;
  capability: ModelCapability;
  reason: string;
}

export function validateRouteDecision(
  decision: ModelRouteDecision
): boolean {
  return Boolean(
    decision.provider &&
    decision.model &&
    decision.capability &&
    decision.reason
  );
}

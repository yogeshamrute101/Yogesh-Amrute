export interface UniversalRequest {
  goal: string;
  input?: unknown;
  priority?: "critical" | "high" | "normal" | "low";
}

export function normalizeUniversalRequest(
  request: UniversalRequest
) {
  return {
    goal: String(request.goal || "").trim(),
    input: request.input ?? {},
    priority: request.priority || "normal",
  };
}

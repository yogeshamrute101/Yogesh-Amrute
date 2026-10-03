export type RuntimeCapability =
  | "text"
  | "image"
  | "video"
  | "audio"
  | "speech-to-text"
  | "image-to-video"
  | "text-to-video"
  | "captions"
  | "timeline"
  | "effects"
  | "export";

export type RuntimeJobStatus =
  | "queued"
  | "running"
  | "completed"
  | "failed"
  | "cancelled";

export interface RuntimeJob {
  id: string;
  capability: RuntimeCapability;
  status: RuntimeJobStatus;
  createdAt: string;
  updatedAt: string;
  error?: string;
  result?: unknown;
}

export interface RuntimeExecutionContext {
  requestId: string;
  projectId?: string;
  userId?: string;
  capability: RuntimeCapability;
}

export function createRuntimeJob(
  id: string,
  capability: RuntimeCapability,
): RuntimeJob {
  const now = new Date().toISOString();

  return {
    id,
    capability,
    status: "queued",
    createdAt: now,
    updatedAt: now,
  };
}

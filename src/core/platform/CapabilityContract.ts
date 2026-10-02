export type CapabilityStatus =
  | "accepted"
  | "running"
  | "completed"
  | "failed"
  | "cancelled"
  | "waiting_approval";

export interface CapabilityDescriptor {
  id: string;
  name: string;
  version: string;
  description: string;
  inputSchema?: unknown;
  outputSchema?: unknown;
  permission?: "read" | "write" | "destructive" | "external";
  supportsAsync?: boolean;
  supportsCancellation?: boolean;
}

export interface CapabilityExecution {
  executionId: string;
  capabilityId: string;
  status: CapabilityStatus;
  startedAt?: string;
  completedAt?: string;
  progress?: number;
  result?: unknown;
  error?: {
    code?: string;
    message: string;
    retryable?: boolean;
  };
  evidence?: unknown;
}

export type Priority = "critical" | "high" | "normal" | "low";

export type TaskStatus =
  | "queued"
  | "planning"
  | "running"
  | "verifying"
  | "repairing"
  | "completed"
  | "failed"
  | "blocked";

export interface UniversalTask {
  id: string;
  projectId?: string;
  title: string;
  input: unknown;
  priority: Priority;
  status: TaskStatus;
  dependencies: string[];
  createdAt: number;
  attempts: number;
  result?: unknown;
  error?: string;
}

export interface ExecutionPlan {
  goal: string;
  tasks: UniversalTask[];
  parallelGroups: string[][];
  unnecessarySteps: string[];
}

export interface VerificationResult {
  passed: boolean;
  errors: string[];
  warnings: string[];
  correctiveActions: string[];
  preventiveActions: string[];
}

export interface SystemResult {
  success: boolean;
  result?: unknown;
  plan: ExecutionPlan;
  verification: VerificationResult;
  attempts: number;
  message: string;
}

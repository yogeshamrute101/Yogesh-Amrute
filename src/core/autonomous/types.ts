export type TaskStatus =
  | "queued"
  | "planning"
  | "running"
  | "verifying"
  | "recovering"
  | "completed"
  | "failed"
  | "skipped";

export type AgentRole =
  | "planner"
  | "researcher"
  | "executor"
  | "verifier"
  | "recovery"
  | "learner";

export interface AutonomousTask {
  id: string;
  title: string;
  description?: string;
  priority: number;
  createdAt: number;
  status: TaskStatus;
  dependencies: string[];
  attempts: number;
  result?: unknown;
  error?: string;
  tags?: string[];
}

export interface Experience {
  id: string;
  task: string;
  outcome: "success" | "failure" | "partial";
  lesson: string;
  createdAt: number;
  reusable: boolean;
}

export interface Workflow {
  id: string;
  name: string;
  goal: string;
  tasks: AutonomousTask[];
  status: TaskStatus;
  createdAt: number;
}

export interface SystemEvent {
  id: string;
  type: string;
  message: string;
  timestamp: number;
  taskId?: string;
  metadata?: Record<string, unknown>;
}

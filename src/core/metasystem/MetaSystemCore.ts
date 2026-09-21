export type MetaSystemMode =
  | "UNDERSTAND"
  | "RESEARCH"
  | "DESIGN"
  | "BUILD"
  | "OPERATE"
  | "VERIFY"
  | "IMPROVE"
  | "RECOVER";

export interface SystemCapability {
  id: string;
  name: string;
  domain: string;
  enabled: boolean;
  dependencies?: string[];
}

export interface MetaTask {
  id: string;
  goal: string;
  priority: number;
  dependencies?: string[];
  requiredCapabilities?: string[];
}

export interface MetaResult {
  taskId: string;
  mode: MetaSystemMode;
  status: "PLANNED" | "READY" | "BLOCKED" | "COMPLETED" | "FAILED";
  steps: string[];
  evidence: string[];
  nextActions: string[];
}

export class MetaSystemCore {
  private capabilities = new Map<string, SystemCapability>();
  private tasks = new Map<string, MetaTask>();

  registerCapability(capability: SystemCapability) {
    this.capabilities.set(capability.id, capability);
    return capability;
  }

  registerTask(task: MetaTask) {
    this.tasks.set(task.id, task);
    return task;
  }

  inspectSystem() {
    return {
      capabilityCount: this.capabilities.size,
      taskCount: this.tasks.size,
      enabledCapabilities: [...this.capabilities.values()]
        .filter(x => x.enabled)
        .map(x => x.id),
    };
  }

  plan(taskId: string): MetaResult {
    const task = this.tasks.get(taskId);

    if (!task) {
      return {
        taskId,
        mode: "UNDERSTAND",
        status: "BLOCKED",
        steps: ["Task not found."],
        evidence: [],
        nextActions: ["Register the task."],
      };
    }

    const missing = (task.requiredCapabilities ?? []).filter(
      id => !this.capabilities.get(id)?.enabled
    );

    if (missing.length) {
      return {
        taskId,
        mode: "DESIGN",
        status: "BLOCKED",
        steps: ["Inspect requirements", "Check capabilities"],
        evidence: [`Missing capabilities: ${missing.join(", ")}`],
        nextActions: ["Add or enable required capabilities."],
      };
    }

    return {
      taskId,
      mode: "DESIGN",
      status: "READY",
      steps: [
        "Understand goal",
        "Inspect context",
        "Reuse existing capabilities",
        "Resolve dependencies",
        "Select execution strategy",
        "Verify before completion",
      ],
      evidence: ["Required registered capabilities are available."],
      nextActions: ["Execute through authorized runtime."],
    };
  }

  prioritize() {
    return [...this.tasks.values()].sort(
      (a, b) => b.priority - a.priority
    );
  }
}

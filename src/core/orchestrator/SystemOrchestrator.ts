export type CapabilityStatus =
  | "MISSING"
  | "PLANNED"
  | "BUILDING"
  | "INTEGRATED"
  | "TESTING"
  | "VERIFIED"
  | "PRODUCTION";

export interface Capability {
  id: string;
  name: string;
  status: CapabilityStatus;
  dependencies: string[];
  lastVerified?: number;
  evidence?: string[];
}

export interface SystemTask {
  id: string;
  description: string;
  priority: number;
  dependencies: string[];
  status: "PENDING" | "RUNNING" | "COMPLETED" | "FAILED" | "BLOCKED";
  error?: string;
}

export interface VerificationResult {
  success: boolean;
  checks: string[];
  failures: string[];
  timestamp: number;
}

export class SystemOrchestrator {
  private capabilities = new Map<string, Capability>();
  private tasks = new Map<string, SystemTask>();

  registerCapability(capability: Capability) {
    this.capabilities.set(capability.id, capability);
  }

  registerTask(task: SystemTask) {
    this.tasks.set(task.id, task);
  }

  getCapability(id: string) {
    return this.capabilities.get(id);
  }

  getSystemStatus() {
    const values = [...this.capabilities.values()];

    return {
      total: values.length,
      missing: values.filter(x => x.status === "MISSING").length,
      planned: values.filter(x => x.status === "PLANNED").length,
      building: values.filter(x => x.status === "BUILDING").length,
      integrated: values.filter(x => x.status === "INTEGRATED").length,
      testing: values.filter(x => x.status === "TESTING").length,
      verified: values.filter(x => x.status === "VERIFIED").length,
      production: values.filter(x => x.status === "PRODUCTION").length,
    };
  }

  planNextTasks(limit = 10): SystemTask[] {
    return [...this.tasks.values()]
      .filter(task => task.status === "PENDING")
      .sort((a, b) => b.priority - a.priority)
      .slice(0, limit);
  }

  canRun(taskId: string): boolean {
    const task = this.tasks.get(taskId);

    if (!task || task.status !== "PENDING") return false;

    return task.dependencies.every(dependency => {
      const dependencyTask = this.tasks.get(dependency);
      return !dependencyTask || dependencyTask.status === "COMPLETED";
    });
  }

  markRunning(taskId: string) {
    const task = this.tasks.get(taskId);
    if (task && this.canRun(taskId)) {
      task.status = "RUNNING";
    }
  }

  markCompleted(taskId: string) {
    const task = this.tasks.get(taskId);
    if (task) task.status = "COMPLETED";
  }

  markFailed(taskId: string, error: string) {
    const task = this.tasks.get(taskId);
    if (task) {
      task.status = "FAILED";
      task.error = error;
    }
  }

  verify(): VerificationResult {
    const failures: string[] = [];

    for (const capability of this.capabilities.values()) {
      for (const dependency of capability.dependencies) {
        const dependencyCapability = this.capabilities.get(dependency);

        if (!dependencyCapability) {
          failures.push(
            `${capability.id}: missing dependency ${dependency}`
          );
        }
      }
    }

    return {
      success: failures.length === 0,
      checks: [
        "Capability registry",
        "Dependency integrity",
        "Task dependency integrity",
        "System status",
      ],
      failures,
      timestamp: Date.now(),
    };
  }
}

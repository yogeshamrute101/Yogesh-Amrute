export type HumanCapabilityDomain =
  | "THINK"
  | "LEARN"
  | "RESEARCH"
  | "WRITE"
  | "READ"
  | "COMMUNICATE"
  | "CODE"
  | "CREATE"
  | "ANALYZE"
  | "PLAN"
  | "ORGANIZE"
  | "MANAGE_FILES"
  | "MANAGE_PROJECTS"
  | "SCHEDULE"
  | "TRANSLATE"
  | "CALCULATE"
  | "TEACH"
  | "ACCESSIBILITY"
  | "MEDIA"
  | "SOFTWARE"
  | "WEB"
  | "AUTOMATION"
  | "DEVICE"
  | "PHYSICAL_WORLD";

export type ActionRisk =
  | "LOW"
  | "MODERATE"
  | "HIGH"
  | "CRITICAL";

export type ExecutionMode =
  | "OBSERVE"
  | "SUGGEST"
  | "REQUEST_APPROVAL"
  | "EXECUTE";

export interface HumanCapability {
  id: string;
  domain: HumanCapabilityDomain;
  description: string;
  enabled: boolean;
  executionMode: ExecutionMode;
  risk: ActionRisk;
  dependencies: string[];
}

export interface HumanTask {
  id: string;
  request: string;
  domain: HumanCapabilityDomain;
  risk: ActionRisk;
  status:
    | "PENDING"
    | "PLANNED"
    | "WAITING_APPROVAL"
    | "RUNNING"
    | "COMPLETED"
    | "FAILED"
    | "BLOCKED";
}

export class HumanCapabilityOrchestrator {
  private capabilities = new Map<string, HumanCapability>();
  private tasks = new Map<string, HumanTask>();

  register(capability: HumanCapability) {
    this.capabilities.set(capability.id, capability);
  }

  registerTask(task: HumanTask) {
    this.tasks.set(task.id, task);
  }

  getCapabilities() {
    return [...this.capabilities.values()];
  }

  getTasks() {
    return [...this.tasks.values()];
  }

  assess(task: HumanTask) {
    const capability = [...this.capabilities.values()].find(
      item => item.domain === task.domain && item.enabled
    );

    if (!capability) {
      return {
        allowed: false,
        mode: "OBSERVE" as ExecutionMode,
        reason: "Required capability is not available.",
      };
    }

    if (task.risk === "HIGH" || task.risk === "CRITICAL") {
      return {
        allowed: true,
        mode: "REQUEST_APPROVAL" as ExecutionMode,
        reason: "Human approval required before high-impact execution.",
      };
    }

    return {
      allowed: true,
      mode: capability.executionMode,
      reason: "Capability available within configured permissions.",
    };
  }

  complete(taskId: string) {
    const task = this.tasks.get(taskId);
    if (task) task.status = "COMPLETED";
  }

  fail(taskId: string) {
    const task = this.tasks.get(taskId);
    if (task) task.status = "FAILED";
  }
}

export default HumanCapabilityOrchestrator;

export type PhysicalNodeType =
  | "CENTRAL_COMPUTER"
  | "SUPERCOMPUTER"
  | "HUMANOID_ROBOT"
  | "SIMULATOR"
  | "SENSOR";

export type PhysicalActionRisk =
  | "LOW"
  | "MEDIUM"
  | "HIGH"
  | "CRITICAL";

export type PhysicalCommandStatus =
  | "RECEIVED"
  | "PLANNED"
  | "SAFETY_CHECK"
  | "APPROVAL_REQUIRED"
  | "EXECUTING"
  | "COMPLETED"
  | "FAILED"
  | "ABORTED";

export interface PhysicalNode {
  id: string;
  type: PhysicalNodeType;
  name: string;
  capabilities: string[];
  online: boolean;
  metadata?: Record<string, unknown>;
}

export interface RobotCommand {
  id: string;
  robotId: string;
  action: string;
  parameters: Record<string, unknown>;
  risk: PhysicalActionRisk;
  requiresApproval: boolean;
  timestamp: number;
}

export interface SensorState {
  id: string;
  type: string;
  value: unknown;
  confidence: number;
  timestamp: number;
}

export interface PhysicalExecutionResult {
  commandId: string;
  status: PhysicalCommandStatus;
  message: string;
  verificationRequired: boolean;
  timestamp: number;
}

export class PhysicalAIOrchestrator {
  private nodes = new Map<string, PhysicalNode>();
  private sensors = new Map<string, SensorState>();
  private commandHistory: PhysicalExecutionResult[] = [];

  registerNode(node: PhysicalNode): void {
    this.nodes.set(node.id, node);
  }

  updateSensor(sensor: SensorState): void {
    this.sensors.set(sensor.id, sensor);
  }

  getNode(nodeId: string): PhysicalNode | undefined {
    return this.nodes.get(nodeId);
  }

  getOnlineNodes(): PhysicalNode[] {
    return [...this.nodes.values()].filter((node) => node.online);
  }

  planRobotCommand(command: RobotCommand): PhysicalExecutionResult {
    const robot = this.nodes.get(command.robotId);

    if (!robot || robot.type !== "HUMANOID_ROBOT") {
      return this.record({
        commandId: command.id,
        status: "FAILED",
        message: "Humanoid robot is not registered.",
        verificationRequired: false,
        timestamp: Date.now(),
      });
    }

    if (!robot.online) {
      return this.record({
        commandId: command.id,
        status: "FAILED",
        message: "Humanoid robot is offline.",
        verificationRequired: false,
        timestamp: Date.now(),
      });
    }

    if (!robot.capabilities.includes(command.action)) {
      return this.record({
        commandId: command.id,
        status: "FAILED",
        message: `Robot capability '${command.action}' is unavailable.`,
        verificationRequired: false,
        timestamp: Date.now(),
      });
    }

    if (command.risk === "CRITICAL" || command.risk === "HIGH") {
      return this.record({
        commandId: command.id,
        status: "APPROVAL_REQUIRED",
        message: "Physical high-impact action requires explicit authorization.",
        verificationRequired: true,
        timestamp: Date.now(),
      });
    }

    return this.record({
      commandId: command.id,
      status: "PLANNED",
      message: "Command passed capability checks and is ready for safety validation.",
      verificationRequired: true,
      timestamp: Date.now(),
    });
  }

  safetyCheck(command: RobotCommand): boolean {
    if (command.risk === "CRITICAL") return false;

    for (const sensor of this.sensors.values()) {
      if (sensor.confidence < 0.4) {
        return false;
      }
    }

    return true;
  }

  execute(
    command: RobotCommand,
    approved = false,
  ): PhysicalExecutionResult {
    const plan = this.planRobotCommand(command);

    if (
      plan.status === "FAILED" ||
      plan.status === "APPROVAL_REQUIRED"
    ) {
      if (!approved) return plan;
    }

    if (!this.safetyCheck(command)) {
      return this.record({
        commandId: command.id,
        status: "ABORTED",
        message: "Safety validation failed. Physical execution blocked.",
        verificationRequired: false,
        timestamp: Date.now(),
      });
    }

    return this.record({
      commandId: command.id,
      status: "EXECUTING",
      message: "Command released to the physical execution layer.",
      verificationRequired: true,
      timestamp: Date.now(),
    });
  }

  verify(commandId: string, success: boolean): PhysicalExecutionResult {
    return this.record({
      commandId,
      status: success ? "COMPLETED" : "FAILED",
      message: success
        ? "Physical action verified."
        : "Physical action verification failed.",
      verificationRequired: false,
      timestamp: Date.now(),
    });
  }

  emergencyStop(reason: string): PhysicalExecutionResult {
    return this.record({
      commandId: `emergency-${Date.now()}`,
      status: "ABORTED",
      message: `Emergency stop activated: ${reason}`,
      verificationRequired: true,
      timestamp: Date.now(),
    });
  }

  private record(
    result: PhysicalExecutionResult,
  ): PhysicalExecutionResult {
    this.commandHistory.push(result);
    this.commandHistory = this.commandHistory.slice(-500);
    return result;
  }

  getHistory(): PhysicalExecutionResult[] {
    return [...this.commandHistory];
  }
}

export const physicalAI = new PhysicalAIOrchestrator();

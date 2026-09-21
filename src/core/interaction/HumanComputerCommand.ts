export type CommandSource = "HUMAN" | "SYSTEM" | "AUTOMATION";

export type CommandRisk = "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";

export type CommandStatus =
  | "RECEIVED"
  | "UNDERSTOOD"
  | "NEEDS_CLARIFICATION"
  | "NEEDS_APPROVAL"
  | "EXECUTABLE"
  | "COMPLETED"
  | "FAILED"
  | "BLOCKED";

export interface HumanCommand {
  id: string;
  source: CommandSource;
  text: string;
  context?: Record<string, unknown>;
  timestamp: number;
}

export interface CommandUnderstanding {
  intent: string;
  parameters: Record<string, unknown>;
  confidence: number;
  risk: CommandRisk;
  requiresApproval: boolean;
  status: CommandStatus;
  explanation: string;
}

export interface ComputerCapability {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
  requiresApproval: boolean;
}

export interface CommandResult {
  commandId: string;
  status: CommandStatus;
  message: string;
  output?: unknown;
  timestamp: number;
}

export class HumanComputerCommandEngine {
  private capabilities = new Map<string, ComputerCapability>();
  private history: CommandResult[] = [];

  registerCapability(capability: ComputerCapability): void {
    this.capabilities.set(capability.id, capability);
  }

  understand(command: HumanCommand): CommandUnderstanding {
    const text = command.text.trim();

    if (!text) {
      return {
        intent: "unknown",
        parameters: {},
        confidence: 0,
        risk: "LOW",
        requiresApproval: false,
        status: "NEEDS_CLARIFICATION",
        explanation: "No command was provided.",
      };
    }

    const lower = text.toLowerCase();

    const intent =
      lower.includes("open") ? "OPEN"
      : lower.includes("close") ? "CLOSE"
      : lower.includes("create") ? "CREATE"
      : lower.includes("delete") ? "DELETE"
      : lower.includes("edit") ? "EDIT"
      : lower.includes("run") ? "RUN"
      : lower.includes("search") ? "SEARCH"
      : lower.includes("check") ? "CHECK"
      : lower.includes("build") ? "BUILD"
      : lower.includes("deploy") ? "DEPLOY"
      : lower.includes("stop") ? "STOP"
      : "GENERAL";

    const risk: CommandRisk =
      ["DELETE", "DEPLOY", "STOP"].includes(intent)
        ? "HIGH"
        : ["BUILD", "EDIT", "RUN"].includes(intent)
          ? "MEDIUM"
          : "LOW";

    const requiresApproval = risk === "HIGH";

    return {
      intent,
      parameters: {
        rawCommand: text,
        context: command.context ?? {},
      },
      confidence: 0.8,
      risk,
      requiresApproval,
      status: requiresApproval
        ? "NEEDS_APPROVAL"
        : "UNDERSTOOD",
      explanation:
        `Command understood as ${intent}. ` +
        `Risk level: ${risk}.`,
    };
  }

  canExecute(intent: string): boolean {
    return [...this.capabilities.values()].some(
      (capability) =>
        capability.enabled &&
        capability.id.toUpperCase() === intent.toUpperCase(),
    );
  }

  execute(
    command: HumanCommand,
    approval = false,
  ): CommandResult {
    const understanding = this.understand(command);

    if (understanding.status === "NEEDS_CLARIFICATION") {
      return this.record({
        commandId: command.id,
        status: "NEEDS_CLARIFICATION",
        message: understanding.explanation,
        timestamp: Date.now(),
      });
    }

    if (
      understanding.requiresApproval &&
      !approval
    ) {
      return this.record({
        commandId: command.id,
        status: "NEEDS_APPROVAL",
        message:
          "This command requires explicit authorization before execution.",
        timestamp: Date.now(),
      });
    }

    if (!this.canExecute(understanding.intent)) {
      return this.record({
        commandId: command.id,
        status: "BLOCKED",
        message:
          `Computer capability '${understanding.intent}' is not registered or enabled.`,
        timestamp: Date.now(),
      });
    }

    return this.record({
      commandId: command.id,
      status: "COMPLETED",
      message:
        `Command '${understanding.intent}' was accepted by the command layer.`,
      output: understanding.parameters,
      timestamp: Date.now(),
    });
  }

  private record(result: CommandResult): CommandResult {
    this.history.push(result);
    this.history = this.history.slice(-500);
    return result;
  }

  getHistory(): CommandResult[] {
    return [...this.history];
  }

  getCapabilities(): ComputerCapability[] {
    return [...this.capabilities.values()];
  }
}

export const humanComputerCommand =
  new HumanComputerCommandEngine();

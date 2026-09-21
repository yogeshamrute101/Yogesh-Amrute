export type CommandRisk =
  | "read-only"
  | "workspace-change"
  | "destructive"
  | "external"
  | "unknown";

export type CommandAssessment = {
  command: string;
  risk: CommandRisk;
  requiresConfirmation: boolean;
  reason: string;
};

export class CommandSafety {
  assess(command: string): CommandAssessment {
    const normalized = command.toLowerCase();

    if (
      normalized.includes("rm -rf") ||
      normalized.includes("git reset --hard") ||
      normalized.includes("git clean -fd")
    ) {
      return {
        command,
        risk: "destructive",
        requiresConfirmation: true,
        reason: "Potentially destructive filesystem or git operation."
      };
    }

    if (
      normalized.includes("curl ") ||
      normalized.includes("wget ") ||
      normalized.includes("ssh ") ||
      normalized.includes("scp ")
    ) {
      return {
        command,
        risk: "external",
        requiresConfirmation: true,
        reason: "Command may communicate with an external system."
      };
    }

    if (
      normalized.includes("sed ") ||
      normalized.includes("grep ") ||
      normalized.includes("find ") ||
      normalized.includes("cat ") ||
      normalized.includes("nl ") ||
      normalized.includes("git status") ||
      normalized.includes("git diff")
    ) {
      return {
        command,
        risk: "read-only",
        requiresConfirmation: false,
        reason: "Command primarily inspects project state."
      };
    }

    return {
      command,
      risk: "unknown",
      requiresConfirmation: true,
      reason: "Command has not been classified as safe."
    };
  }
}

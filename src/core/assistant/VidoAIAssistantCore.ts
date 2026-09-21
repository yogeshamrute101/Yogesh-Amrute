export type AssistantMode =
  | "UNDERSTAND"
  | "RESEARCH"
  | "REASON"
  | "PLAN"
  | "ACT"
  | "VERIFY"
  | "EXPLAIN"
  | "ASK";

export interface AssistantContext {
  userInput: string;
  projectState?: unknown;
  evidence?: unknown[];
  history?: unknown[];
  permissions?: string[];
}

export interface AssistantResponse {
  mode: AssistantMode;
  answer: string;
  actions: string[];
  evidence: unknown[];
  confidence: number;
  needsApproval: boolean;
  needsMoreInformation: boolean;
}

export class VidoAIAssistantCore {
  private mode: AssistantMode = "UNDERSTAND";

  respond(context: AssistantContext): AssistantResponse {
    const input = context.userInput.trim();

    if (!input) {
      this.mode = "ASK";
      return {
        mode: this.mode,
        answer: "I need an instruction or question to continue.",
        actions: [],
        evidence: [],
        confidence: 1,
        needsApproval: false,
        needsMoreInformation: true,
      };
    }

    this.mode = "UNDERSTAND";

    const actions: string[] = [
      "Understand the request",
      "Use available project context",
      "Check relevant evidence",
      "Reason before acting",
      "Prefer the smallest safe change",
      "Verify the result",
    ];

    const needsApproval =
      input.toLowerCase().includes("delete") ||
      input.toLowerCase().includes("deploy") ||
      input.toLowerCase().includes("publish") ||
      input.toLowerCase().includes("external");

    return {
      mode: "UNDERSTAND",
      answer: `Request understood: ${input}`,
      actions,
      evidence: context.evidence ?? [],
      confidence: context.evidence?.length ? 0.9 : 0.7,
      needsApproval,
      needsMoreInformation: false,
    };
  }

  getMode(): AssistantMode {
    return this.mode;
  }
}

export default VidoAIAssistantCore;

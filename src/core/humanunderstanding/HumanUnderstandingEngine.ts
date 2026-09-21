export type HumanSignal =
  | "REQUEST"
  | "QUESTION"
  | "PREFERENCE"
  | "CONCERN"
  | "CONFUSION"
  | "FEEDBACK"
  | "APPROVAL"
  | "REJECTION"
  | "UNCERTAINTY";

export interface HumanContext {
  personId?: string;
  intent?: string;
  preferences?: Record<string, unknown>;
  communicationStyle?: string;
  constraints?: string[];
  observedSignals?: HumanSignal[];
}

export class HumanUnderstandingEngine {
  understand(context: HumanContext) {
    return {
      intent: context.intent ?? "UNKNOWN",
      preferences: context.preferences ?? {},
      constraints: context.constraints ?? [],
      signals: context.observedSignals ?? [],
      confidence: context.intent ? 0.8 : 0.2,
      note: "Human behavior is interpreted probabilistically, not assumed with certainty.",
    };
  }
}

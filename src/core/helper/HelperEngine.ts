export type HelpMode =
  | "EXPLAIN"
  | "GUIDE"
  | "TEACH"
  | "TROUBLESHOOT"
  | "RECOMMEND"
  | "ASSIST"
  | "MONITOR";

export interface HelpRequest {
  id: string;
  mode: HelpMode;
  userGoal: string;
  context?: Record<string, unknown>;
}

export class HelperEngine {
  help(request: HelpRequest) {
    return {
      id: request.id,
      mode: request.mode,
      goal: request.userGoal,
      steps: [],
      assumptions: [],
      uncertainties: [],
      requiresUserConfirmation: false,
    };
  }
}

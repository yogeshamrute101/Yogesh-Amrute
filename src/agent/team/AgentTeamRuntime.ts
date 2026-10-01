import { teamOrchestrator } from "./TeamOrchestrator";
import { routeCapabilities } from "./CapabilityRouter";

export type TeamRuntimeResult = {
  success: boolean;
  plan: string[];
  results: unknown[];
  errors: string[];
};

export async function executeWithAgentTeam(
  taskId: string,
  prompt: string,
): Promise<TeamRuntimeResult> {
  const matches = routeCapabilities(prompt);

  const plan = matches.map((match) => match.capability);
  const results: unknown[] = [];
  const errors: string[] = [];

  for (const match of matches) {
    const result = await teamOrchestrator.delegate(
      {
        taskId,
        prompt,
        capabilities: plan,
      },
      match.capability,
    );

    results.push(result);

    if (!result.success && result.error) {
      errors.push(result.error);
    }
  }

  return {
    success: errors.length === 0,
    plan,
    results,
    errors,
  };
}

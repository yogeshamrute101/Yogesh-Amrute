import { getMasterSystemState } from "./MasterCommand";
import { verifySystemIntegrity } from "./verification/SystemVerifier";

export function getFinalSystemStatus() {
  const verification = verifySystemIntegrity();
  const state = getMasterSystemState();

  return {
    healthy: verification.healthy,
    verification,
    tasks: state.tasks.length,
    learningEvents: state.learningMemory.length,
    architecture: [
      "Command",
      "Understand",
      "Plan",
      "Prioritize",
      "Skip unnecessary work",
      "Execute",
      "Verify",
      "Recover",
      "Learn",
      "Complete",
    ],
  };
}

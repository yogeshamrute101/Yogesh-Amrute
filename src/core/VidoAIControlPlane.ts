import {
  createAutonomousOS,
  TaskExecutor,
} from "./autonomous";

import {
  executeVidoAICommand,
} from "./universal/FinalCommandBridge";

export class VidoAIControlPlane {
  readonly autonomous = createAutonomousOS();

  async command(
    goal: string,
    executor?: TaskExecutor
  ) {
    if (executor) {
      return this.autonomous.runGoal(
        goal,
        executor
      );
    }

    return executeVidoAICommand(goal);
  }

  status() {
    return this.autonomous.status();
  }
}

export const vidoAIControlPlane =
  new VidoAIControlPlane();

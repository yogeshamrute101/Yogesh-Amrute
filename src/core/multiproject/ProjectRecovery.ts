import { ProjectExecutionState } from "./MultiProjectOrchestrator";

export class ProjectRecovery {
  checkpoint(
    state: ProjectExecutionState
  ) {
    return JSON.parse(JSON.stringify(state));
  }

  recover(
    checkpoint: ProjectExecutionState
  ) {
    return {
      ...checkpoint,
      activeTasks: [],
    };
  }
}

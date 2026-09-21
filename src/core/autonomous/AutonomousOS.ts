import {
  AutonomousTask,
} from "./types";
import {
  AutonomousWorkflowEngine,
  TaskExecutor,
} from "./workflow/AutonomousWorkflowEngine";
import { autonomousAgents } from "./agents/AgentRegistry";

export class VidoAIAutonomousOS {
  readonly engine = new AutonomousWorkflowEngine();
  readonly agents = autonomousAgents;

  create(goal: string) {
    return this.engine.createWorkflow(goal);
  }

  async execute(executor: TaskExecutor) {
    return this.engine.run(executor);
  }

  status() {
    return {
      agents: this.agents,
      workflows: this.engine.workflowsList(),
      tasks: this.engine.queue.all(),
      events: this.engine.monitor.recent(),
      experience: this.engine.experience.all(),
    };
  }

  async runGoal(
    goal: string,
    executor: TaskExecutor
  ) {
    this.create(goal);
    return this.execute(executor);
  }
}

export function createAutonomousOS() {
  return new VidoAIAutonomousOS();
}

export type { AutonomousTask };

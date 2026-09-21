import { AutonomousTask, Workflow } from "../types";
import { planGoal, removeUnnecessaryTasks } from "../planner/AutonomousPlanner";
import { AutonomousQueue } from "../queue/AutonomousQueue";
import { ExperienceEngine } from "../learning/ExperienceEngine";
import { AutonomousMonitor } from "../observability/AutonomousMonitor";
import { SelfHealingEngine } from "../recovery/SelfHealingEngine";

export type TaskExecutor = (
  task: AutonomousTask
) => Promise<unknown>;

export class AutonomousWorkflowEngine {
  readonly queue = new AutonomousQueue();
  readonly experience = new ExperienceEngine();
  readonly monitor = new AutonomousMonitor();
  readonly recovery = new SelfHealingEngine();

  private workflows: Workflow[] = [];

  createWorkflow(goal: string): Workflow {
    const tasks = removeUnnecessaryTasks(planGoal(goal));

    const workflow: Workflow = {
      id: `workflow_${Date.now()}`,
      name: "Autonomous Workflow",
      goal,
      tasks,
      status: "queued",
      createdAt: Date.now(),
    };

    this.workflows.push(workflow);
    this.queue.add(tasks);

    this.monitor.emit(
      "workflow.created",
      `Workflow created for: ${goal}`,
      undefined,
      { taskCount: tasks.length }
    );

    return workflow;
  }

  async run(executor: TaskExecutor) {
    const completed: unknown[] = [];

    while (true) {
      const task = this.queue.next();

      if (!task) break;

      this.queue.update(task.id, { status: "running" });

      this.monitor.emit(
        "task.started",
        task.title,
        task.id
      );

      try {
        const result = await executor(task);

        this.queue.update(task.id, {
          status: "completed",
          result,
        });

        this.experience.learn({
          task: task.title,
          outcome: "success",
          lesson: `Successful execution: ${task.title}`,
          reusable: true,
        });

        this.monitor.emit(
          "task.completed",
          task.title,
          task.id
        );

        completed.push(result);
      } catch (error) {
        this.queue.update(task.id, {
          status: "recovering",
        });

        const recovery = await this.recovery.recover(
          task,
          error
        );

        this.queue.update(
          task.id,
          recovery.task
        );

        this.monitor.emit(
          "task.recovery",
          `${task.title}: ${recovery.action}`,
          task.id
        );

        if (recovery.action === "fail") {
          this.experience.learn({
            task: task.title,
            outcome: "failure",
            lesson: String(
              error instanceof Error
                ? error.message
                : error
            ),
            reusable: true,
          });
        }
      }
    }

    return {
      completed,
      tasks: this.queue.all(),
      events: this.monitor.recent(),
      experience: this.experience.all(),
    };
  }

  workflowsList() {
    return [...this.workflows];
  }
}

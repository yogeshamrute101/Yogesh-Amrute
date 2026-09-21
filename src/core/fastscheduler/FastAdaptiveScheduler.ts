export type Priority =
  | "CRITICAL"
  | "DEADLINE"
  | "HIGH"
  | "NORMAL"
  | "BACKGROUND";

export interface WorkItem {
  id: string;
  createdAt: number;
  priority: Priority;
  deadline?: number;
  estimatedCost?: number;
  value?: number;
  dependencies?: string[];
  steps: WorkStep[];
}

export interface WorkStep {
  id: string;
  name: string;
  required: boolean;
  cost?: number;
  dependencies?: string[];
  replaceable?: boolean;
  replacement?: string;
  completed?: boolean;
}

export interface ScheduledWork {
  ordered: WorkItem[];
  parallelGroups: WorkItem[][];
  skippedSteps: string[];
  replacementSteps: Record<string, string>;
}

const priorityRank: Record<Priority, number> = {
  CRITICAL: 0,
  DEADLINE: 1,
  HIGH: 2,
  NORMAL: 3,
  BACKGROUND: 4,
};

export class FastAdaptiveScheduler {
  schedule(items: WorkItem[]): ScheduledWork {
    const skippedSteps: string[] = [];
    const replacementSteps: Record<string, string> = {};

    const normalized = items.map(item => ({
      ...item,
      steps: item.steps.filter(step => {
        if (!step.required && !step.dependencies?.length) {
          skippedSteps.push(step.id);
          return false;
        }

        if (step.replaceable && step.replacement) {
          replacementSteps[step.id] = step.replacement;
        }

        return true;
      }),
    }));

    const ordered = [...normalized].sort((a, b) => {
      const priorityDiff =
        priorityRank[a.priority] - priorityRank[b.priority];

      if (priorityDiff !== 0) return priorityDiff;

      if (
        a.deadline !== undefined &&
        b.deadline !== undefined &&
        a.deadline !== b.deadline
      ) {
        return a.deadline - b.deadline;
      }

      if ((a.value ?? 0) !== (b.value ?? 0)) {
        return (b.value ?? 0) - (a.value ?? 0);
      }

      return a.createdAt - b.createdAt;
    });

    const parallelGroups: WorkItem[][] = [];
    const used = new Set<string>();

    for (const item of ordered) {
      if (used.has(item.id)) continue;

      const group = ordered.filter(candidate => {
        if (used.has(candidate.id)) return false;

        const deps = candidate.dependencies ?? [];
        return deps.length === 0;
      });

      if (group.length) {
        group.forEach(x => used.add(x.id));
        parallelGroups.push(group);
      }
    }

    return {
      ordered,
      parallelGroups,
      skippedSteps,
      replacementSteps,
    };
  }
}

export interface ExecutionTask {
  id: string;
  dependencies?: string[];
  reusableCapability?: string;
  parallelSafe?: boolean;
  estimatedCost: number;
}

export class SmartExecutionPlanner {
  plan(tasks: ExecutionTask[]) {
    const reusable = tasks.filter(x => x.reusableCapability);
    const parallel = tasks.filter(x => x.parallelSafe);
    const sequential = tasks.filter(x => !x.parallelSafe);

    return {
      reuseCount: reusable.length,
      parallelCount: parallel.length,
      sequentialCount: sequential.length,
      orderedTasks: [...tasks].sort(
        (a, b) => a.estimatedCost - b.estimatedCost
      ),
    };
  }
}

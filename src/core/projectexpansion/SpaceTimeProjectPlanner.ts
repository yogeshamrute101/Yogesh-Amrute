export interface ProjectSchedule {
  phase: string;
  startMs: number;
  durationMs: number;
  dependencies: string[];
}

export class SpaceTimeProjectPlanner {
  schedule(
    phases: string[],
    startMs: number,
    phaseDurationMs: number
  ): ProjectSchedule[] {
    let cursor = startMs;

    return phases.map((phase, index) => {
      const item = {
        phase,
        startMs: cursor,
        durationMs: phaseDurationMs,
        dependencies: index ? [phases[index - 1]] : [],
      };

      cursor += phaseDurationMs;
      return item;
    });
  }
}

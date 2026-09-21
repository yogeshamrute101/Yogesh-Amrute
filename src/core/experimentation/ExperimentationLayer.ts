export type Experiment = {
  id: string;
  hypothesis: string;
  status: "planned" | "running" | "completed" | "failed";
};

export class ExperimentationLayer {
  private experiments = new Map<string, Experiment>();

  create(experiment: Experiment) {
    this.experiments.set(experiment.id, experiment);
    return experiment;
  }

  list() {
    return [...this.experiments.values()];
  }
}

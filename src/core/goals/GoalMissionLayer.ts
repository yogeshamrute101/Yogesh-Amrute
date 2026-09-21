export type Goal = {
  id: string;
  title: string;
  objective: string;
  milestones: string[];
  status: "planned" | "active" | "blocked" | "completed";
};

export class GoalMissionLayer {
  private goals = new Map<string, Goal>();

  create(goal: Goal) {
    this.goals.set(goal.id, goal);
    return goal;
  }

  update(id: string, status: Goal["status"]) {
    const goal = this.goals.get(id);
    if (!goal) return undefined;
    goal.status = status;
    return goal;
  }

  list() {
    return [...this.goals.values()];
  }
}

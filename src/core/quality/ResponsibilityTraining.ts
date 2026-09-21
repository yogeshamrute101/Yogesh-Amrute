export interface Responsibility {
  id: string;
  role: string;
  responsibility: string;
  authority?: string;
  requiredTrainingIds?: string[];
}

export interface TrainingRecord {
  id: string;
  personOrRole: string;
  training: string;
  completedAt?: string;
  validUntil?: string;
  status: "REQUIRED" | "COMPLETED" | "EXPIRED";
}

export class ResponsibilityTrainingManager {
  private responsibilities: Responsibility[] = [];
  private training: TrainingRecord[] = [];

  addResponsibility(item: Responsibility) {
    this.responsibilities.push(item);
    return item;
  }

  addTraining(item: TrainingRecord) {
    this.training.push(item);
    return item;
  }

  getResponsibilities() {
    return [...this.responsibilities];
  }

  getTraining() {
    return [...this.training];
  }
}

export interface DecisionRecord {
  id: string;
  timestamp: number;
  goal: string;
  selectedOptionId: string;
  expectedOutcome?: string;
  actualOutcome?: string;
  verified: boolean;
  lesson?: string;
}

export class DecisionMemory {
  private records: DecisionRecord[] = [];

  remember(record: DecisionRecord) {
    this.records.push(record);
    return record;
  }

  recall(goal: string) {
    return this.records.filter(
      record => record.goal.toLowerCase() === goal.toLowerCase()
    );
  }

  learn(goal: string, actualOutcome: string) {
    return this.recall(goal).map(record => ({
      ...record,
      actualOutcome,
      verified: true,
    }));
  }
}

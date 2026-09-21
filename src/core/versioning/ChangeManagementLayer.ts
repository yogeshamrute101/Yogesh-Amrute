export type ChangeRecord = {
  id: string;
  component: string;
  description: string;
  version?: string;
  timestamp: number;
};

export class ChangeManagementLayer {
  private changes: ChangeRecord[] = [];

  record(change: ChangeRecord) {
    this.changes.push(change);
    return change;
  }

  history() {
    return [...this.changes];
  }
}

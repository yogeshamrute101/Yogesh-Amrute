export type ApprovalRequest = {
  id: string;
  action: string;
  risk: "low" | "medium" | "high" | "critical";
  approved?: boolean;
};

export class HumanOversightLayer {
  private pending: ApprovalRequest[] = [];

  request(input: ApprovalRequest) {
    this.pending.push(input);
    return input;
  }

  pendingRequests() {
    return [...this.pending];
  }

  resolve(id: string, approved: boolean) {
    const item = this.pending.find(x => x.id === id);
    if (item) item.approved = approved;
    return item;
  }
}

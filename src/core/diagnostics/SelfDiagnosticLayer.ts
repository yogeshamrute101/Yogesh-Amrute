export type DiagnosticResult = {
  component: string;
  status: "healthy" | "warning" | "failed" | "unknown";
  message: string;
  timestamp: number;
};

export class SelfDiagnosticLayer {
  private results: DiagnosticResult[] = [];

  check(result: DiagnosticResult) {
    this.results.push(result);
    return result;
  }

  health() {
    if (this.results.some(r => r.status === "failed")) return "failed";
    if (this.results.some(r => r.status === "warning")) return "warning";
    if (this.results.length === 0) return "unknown";
    return "healthy";
  }

  history() {
    return [...this.results];
  }
}

export type TestResult = {
  name: string;
  passed: boolean;
  details?: string;
};

export class QualityAssuranceLayer {
  private results: TestResult[] = [];

  record(result: TestResult) {
    this.results.push(result);
    return result;
  }

  allPassed() {
    return this.results.length > 0 && this.results.every(x => x.passed);
  }

  resultsList() {
    return [...this.results];
  }
}

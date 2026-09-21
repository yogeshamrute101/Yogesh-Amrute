export type CanaryResult = {
  changeId: string;
  isolated: boolean;
  passed: boolean;
  risks: string[];
};

export class CanaryTestingLayer {
  test(result: CanaryResult) {
    return {
      ...result,
      promotable: result.isolated && result.passed && result.risks.length === 0
    };
  }
}

export interface VerificationCheck {
  name: string;
  passed: boolean;
  evidence?: string;
}

export class MetaVerification {
  evaluate(checks: VerificationCheck[]) {
    const passed = checks.filter(x => x.passed).length;

    return {
      total: checks.length,
      passed,
      failed: checks.length - passed,
      verified:
        checks.length > 0 && passed === checks.length,
    };
  }
}

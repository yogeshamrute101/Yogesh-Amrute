export interface ResultCheck {
  name: string;
  passed: boolean;
  evidence?: string;
}

export interface VerifiedResult<T = unknown> {
  result: T;
  checks: ResultCheck[];
  correct: boolean;
  confidence: number;
  needsCorrection: boolean;
}

export class VerifiedResultEngine {
  verify<T>(
    result: T,
    checks: ResultCheck[]
  ): VerifiedResult<T> {
    const passed = checks.filter(x => x.passed).length;
    const confidence = checks.length ? passed / checks.length : 0;
    const correct = checks.length > 0 && checks.every(x => x.passed);

    return {
      result,
      checks,
      correct,
      confidence,
      needsCorrection: !correct,
    };
  }
}

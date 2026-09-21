export type UXCheck = {
  element: string;
  accessible: boolean;
  readable: boolean;
  actionable: boolean;
};

export class UXAccessibilityLayer {
  evaluate(check: UXCheck) {
    return {
      ...check,
      passed: check.accessible && check.readable && check.actionable
    };
  }
}

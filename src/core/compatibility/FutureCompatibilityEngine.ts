export interface CompatibilityCheck {
  currentVersion: string;
  targetVersion: string;
  compatible: boolean;
  breakingChanges: string[];
  migrationRequired: boolean;
}

export class FutureCompatibilityEngine {
  check(
    currentVersion: string,
    targetVersion: string,
    breakingChanges: string[] = []
  ): CompatibilityCheck {
    return {
      currentVersion,
      targetVersion,
      compatible: breakingChanges.length === 0,
      breakingChanges,
      migrationRequired: breakingChanges.length > 0,
    };
  }
}

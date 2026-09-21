export interface ScopeDefinition {
  purpose: string;
  objectives: string[];
  included: string[];
  excluded: string[];
  limits: string[];
  assumptions: string[];
  successCriteria: string[];
}

export class ScopePurposeLimitEngine {
  define(scope: ScopeDefinition) {
    return {
      ...scope,
      valid:
        Boolean(scope.purpose) &&
        scope.objectives.length > 0 &&
        scope.successCriteria.length > 0,
    };
  }

  isAllowed(scope: ScopeDefinition, action: string) {
    if (scope.excluded.includes(action)) return false;
    return scope.included.length === 0 || scope.included.includes(action);
  }
}

export type ConstitutionRule = {
  id: string;
  principle: string;
  priority: number;
  enabled: boolean;
};

export class SystemConstitution {
  private rules: ConstitutionRule[] = [];

  addRule(rule: ConstitutionRule) {
    this.rules.push(rule);
    return rule;
  }

  getRules() {
    return [...this.rules].sort((a, b) => b.priority - a.priority);
  }

  activeRules() {
    return this.getRules().filter(r => r.enabled);
  }
}

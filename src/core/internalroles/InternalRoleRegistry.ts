export type InternalRole =
  | "PROCESSOR"
  | "RESEARCHER"
  | "ANALYST"
  | "PLANNER"
  | "CREATOR"
  | "MAKER"
  | "HELPER"
  | "VERIFIER"
  | "AUDITOR"
  | "TEACHER"
  | "RECOVERY"
  | "QUALITY"
  | "COORDINATOR";

export interface InternalRoleDefinition {
  id: string;
  role: InternalRole;
  purpose: string;
  capabilities: string[];
  limits: string[];
}

export class InternalRoleRegistry {
  private roles = new Map<string, InternalRoleDefinition>();

  register(role: InternalRoleDefinition) {
    this.roles.set(role.id, { ...role });
    return role;
  }

  get(id: string) {
    return this.roles.get(id);
  }

  all() {
    return [...this.roles.values()];
  }
}

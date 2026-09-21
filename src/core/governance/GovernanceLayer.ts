export type PermissionLevel = "observe" | "suggest" | "request" | "execute" | "admin";

export class GovernanceLayer {
  private order: PermissionLevel[] = ["observe", "suggest", "request", "execute", "admin"];

  allowed(required: PermissionLevel, granted: PermissionLevel) {
    return this.order.indexOf(granted) >= this.order.indexOf(required);
  }

  requiresApproval(required: PermissionLevel) {
    return required === "execute" || required === "admin";
  }
}

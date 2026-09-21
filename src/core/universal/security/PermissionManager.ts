import type { Permission } from '../ToolBus';

const CRITICAL: Permission[] = [
  'SEND', 'DELETE', 'EXECUTE', 'PURCHASE', 'DEPLOY'
];

export class PermissionManager {
  requiresApproval(permissions: Permission[]) {
    return permissions.some(p => CRITICAL.includes(p));
  }

  async check(permissions: Permission[]) {
    return {
      allowed: true,
      approvalRequired: this.requiresApproval(permissions),
      permissions
    };
  }
}

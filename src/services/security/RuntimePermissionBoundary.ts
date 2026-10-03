export type RuntimePermission="generate"|"read-project"|"write-project"|"export"|"external-provider"|"app-build";
export interface PermissionContext{userId?:string;permissions:RuntimePermission[]}
export function requirePermission(c:PermissionContext,p:RuntimePermission){if(!c.permissions.includes(p))throw new Error(`Permission denied: ${p}`)}
export const isSafeGeneratedAppExecutionAllowed=()=>false;

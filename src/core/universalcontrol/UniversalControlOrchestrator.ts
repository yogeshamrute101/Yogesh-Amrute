/**
 * VidoAI Universal Control Orchestrator
 *
 * Common control contract for authorized mobile, computer, software-agent,
 * server and physical-robot integrations.
 *
 * This layer does NOT bypass authentication, authorization or safety.
 * Real control requires a registered, tested adapter for the target.
 */

export type TargetType =
  | "MOBILE"
  | "TABLET"
  | "COMPUTER"
  | "SOFTWARE_ROBOT"
  | "SERVER"
  | "CLOUD"
  | "VM"
  | "CONTAINER"
  | "IOT"
  | "PHYSICAL_ROBOT";

export type ControlAction =
  | "DISCOVER"
  | "INSPECT"
  | "STATUS"
  | "START"
  | "STOP"
  | "PAUSE"
  | "RESUME"
  | "RESTART"
  | "OPEN"
  | "CLOSE"
  | "READ"
  | "WRITE"
  | "CONFIGURE"
  | "INSTALL"
  | "UPDATE"
  | "EXECUTE"
  | "MOVE"
  | "NAVIGATE"
  | "RECOVER"
  | "EMERGENCY_STOP";

export type ControlStatus =
  | "REQUESTED"
  | "DISCOVERING"
  | "AUTHENTICATING"
  | "AUTHORIZED"
  | "PLANNED"
  | "EXECUTING"
  | "MONITORING"
  | "VERIFIED"
  | "FAILED"
  | "RECOVERING"
  | "BLOCKED"
  | "OFFLINE"
  | "REQUIRES_REVIEW"
  | "EMERGENCY_STOPPED";

export interface ControlTarget {
  id: string;
  name: string;
  type: TargetType;
  capabilities: ControlAction[];
  authenticated: boolean;
  authorized: boolean;
  online: boolean;
  healthScore?: number;
}

export interface ControlRequest {
  id: string;
  targetId: string;
  action: ControlAction;
  parameters?: Record<string, unknown>;
  requestedBy: string;
  requiresApproval?: boolean;
  highImpact?: boolean;
}

export interface ControlResult {
  requestId: string;
  status: ControlStatus;
  success: boolean;
  verified: boolean;
  evidence: string[];
  errors: string[];
}

export interface ControlAdapter {
  supports(target: ControlTarget, action: ControlAction): boolean;

  inspect(target: ControlTarget): Promise<ControlResult>;

  execute(
    request: ControlRequest,
    target: ControlTarget
  ): Promise<ControlResult>;

  verify(
    request: ControlRequest,
    result: ControlResult
  ): Promise<ControlResult>;

  recover?(
    request: ControlRequest,
    result: ControlResult
  ): Promise<ControlResult>;
}

export class UniversalControlOrchestrator {
  private targets = new Map<string, ControlTarget>();
  private adapters: ControlAdapter[] = [];

  registerTarget(target: ControlTarget): void {
    this.targets.set(target.id, target);
  }

  registerAdapter(adapter: ControlAdapter): void {
    if (!this.adapters.includes(adapter)) {
      this.adapters.push(adapter);
    }
  }

  getTarget(id: string): ControlTarget | undefined {
    return this.targets.get(id);
  }

  listTargets(): ControlTarget[] {
    return [...this.targets.values()];
  }

  findAdapter(
    target: ControlTarget,
    action: ControlAction
  ): ControlAdapter | undefined {
    return this.adapters.find(a => a.supports(target, action));
  }

  async execute(request: ControlRequest): Promise<ControlResult> {
    const target = this.targets.get(request.targetId);

    if (!target) {
      return {
        requestId: request.id,
        status: "BLOCKED",
        success: false,
        verified: false,
        evidence: [],
        errors: ["Target is not registered."]
      };
    }

    if (!target.authenticated || !target.authorized) {
      return {
        requestId: request.id,
        status: "BLOCKED",
        success: false,
        verified: false,
        evidence: [],
        errors: ["Authentication or authorization is missing."]
      };
    }

    if (!target.online) {
      return {
        requestId: request.id,
        status: "OFFLINE",
        success: false,
        verified: false,
        evidence: [],
        errors: ["Target is currently offline."]
      };
    }

    if (request.requiresApproval || request.highImpact) {
      return {
        requestId: request.id,
        status: "REQUIRES_REVIEW",
        success: false,
        verified: false,
        evidence: [],
        errors: ["Appropriate human authorization is required."]
      };
    }

    const adapter = this.findAdapter(target, request.action);

    if (!adapter) {
      return {
        requestId: request.id,
        status: "BLOCKED",
        success: false,
        verified: false,
        evidence: [],
        errors: ["No compatible control adapter is registered."]
      };
    }

    const result = await adapter.execute(request, target);
    return adapter.verify(request, result);
  }
}

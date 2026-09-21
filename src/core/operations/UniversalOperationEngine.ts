/**
 * VidoAI Universal Operation Engine
 *
 * Common controlled operation contract for supported system domains.
 * It does not bypass permissions, safety, validation or verification.
 */

export type UniversalOperation =
  | "ADD"
  | "SUBTRACT"
  | "REMOVE"
  | "REPLACE"
  | "UPDATE"
  | "INSERT"
  | "DELETE"
  | "MERGE"
  | "SPLIT"
  | "MOVE"
  | "COPY"
  | "CLONE"
  | "RENAME"
  | "REORDER"
  | "SORT"
  | "FILTER"
  | "MAP"
  | "REDUCE"
  | "TRANSFORM"
  | "CONVERT"
  | "FORMAT"
  | "NORMALIZE"
  | "COMPARE"
  | "DIFF"
  | "PATCH"
  | "ROLLBACK"
  | "RESTORE"
  | "DUPLICATE"
  | "DEDUPLICATE"
  | "ENABLE"
  | "DISABLE"
  | "CONNECT"
  | "DISCONNECT"
  | "IMPORT"
  | "EXPORT"
  | "CREATE"
  | "ARCHIVE"
  | "UNARCHIVE"
  | "VALIDATE"
  | "VERIFY"
  | "SIMULATE";

export type OperationStatus =
  | "REQUESTED"
  | "PLANNED"
  | "PREVIEWED"
  | "VALIDATED"
  | "AUTHORIZED"
  | "APPLIED"
  | "VERIFIED"
  | "ROLLED_BACK"
  | "BLOCKED"
  | "FAILED"
  | "REQUIRES_REVIEW";

export interface OperationRequest {
  id: string;
  operation: UniversalOperation;
  domain: string;
  target: string;
  input?: unknown;
  requestedBy: string;
  destructive?: boolean;
  requiresApproval?: boolean;
}

export interface OperationPlan {
  requestId: string;
  operation: UniversalOperation;
  target: string;
  changes: string[];
  risks: string[];
  reversible: boolean;
}

export interface OperationResult {
  requestId: string;
  status: OperationStatus;
  success: boolean;
  verified: boolean;
  changes: string[];
  evidence: string[];
  errors: string[];
}

export interface OperationAdapter {
  supports(operation: UniversalOperation, domain: string): boolean;

  preview(request: OperationRequest): Promise<OperationPlan>;

  apply(
    request: OperationRequest,
    plan: OperationPlan
  ): Promise<OperationResult>;

  verify(
    request: OperationRequest,
    result: OperationResult
  ): Promise<OperationResult>;

  rollback?(
    request: OperationRequest,
    result: OperationResult
  ): Promise<OperationResult>;
}

export class UniversalOperationEngine {
  private adapters: OperationAdapter[] = [];

  register(adapter: OperationAdapter): void {
    if (!this.adapters.includes(adapter)) {
      this.adapters.push(adapter);
    }
  }

  listOperations(): UniversalOperation[] {
    return [
      "ADD","SUBTRACT","REMOVE","REPLACE","UPDATE","INSERT","DELETE",
      "MERGE","SPLIT","MOVE","COPY","CLONE","RENAME","REORDER","SORT",
      "FILTER","MAP","REDUCE","TRANSFORM","CONVERT","FORMAT","NORMALIZE",
      "COMPARE","DIFF","PATCH","ROLLBACK","RESTORE","DUPLICATE",
      "DEDUPLICATE","ENABLE","DISABLE","CONNECT","DISCONNECT","IMPORT",
      "EXPORT","CREATE","ARCHIVE","UNARCHIVE","VALIDATE","VERIFY","SIMULATE"
    ];
  }

  findAdapter(request: OperationRequest): OperationAdapter | undefined {
    return this.adapters.find(a =>
      a.supports(request.operation, request.domain)
    );
  }

  async plan(request: OperationRequest): Promise<OperationPlan> {
    const adapter = this.findAdapter(request);

    if (!adapter) {
      return {
        requestId: request.id,
        operation: request.operation,
        target: request.target,
        changes: [],
        risks: ["No registered adapter supports this operation/domain."],
        reversible: false
      };
    }

    return adapter.preview(request);
  }

  async execute(
    request: OperationRequest,
    plan: OperationPlan
  ): Promise<OperationResult> {
    const adapter = this.findAdapter(request);

    if (!adapter) {
      return {
        requestId: request.id,
        status: "BLOCKED",
        success: false,
        verified: false,
        changes: [],
        evidence: [],
        errors: ["Operation blocked: no compatible adapter."]
      };
    }

    if (
      request.destructive ||
      request.requiresApproval
    ) {
      return {
        requestId: request.id,
        status: "REQUIRES_REVIEW",
        success: false,
        verified: false,
        changes: plan.changes,
        evidence: [],
        errors: ["Explicit authorization is required before this operation."]
      };
    }

    const result = await adapter.apply(request, plan);
    return adapter.verify(request, result);
  }
}

import {
  ActionRisk,
  ImaginationExecutionContext,
  RealWorldAction,
  RealWorldActionResult,
  RealWorldExecutionPolicy,
} from './InstructorRealWorldActionTypes';

const DEFAULT_POLICY: RealWorldExecutionPolicy = {
  allowReadOnlyAutonomy: true,
  allowReversibleAutonomy: true,
  requirePermissionForExternalSideEffects: true,
  requireVerificationAfterExecution: true,
  allowArbitraryShell: false,
  allowUnboundedLoops: false,
  maxActionsPerInitiative: 3,
};

const id = (prefix: string): string =>
  `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;

const externalRisk = (risk: ActionRisk): boolean =>
  risk === 'external-side-effect' || risk === 'high-impact';

export class InstructorRealWorldExecutor {
  private readonly policy: RealWorldExecutionPolicy;

  constructor(policy: Partial<RealWorldExecutionPolicy> = {}) {
    this.policy = {
      ...DEFAULT_POLICY,
      ...policy,
      allowArbitraryShell: false,
      allowUnboundedLoops: false,
    };
  }

  createAction(
    context: ImaginationExecutionContext,
  ): RealWorldAction {
    const text =
      `${context.imaginedIdea} ${context.requestedOutcome ?? ''}`.toLowerCase();

    const research =
      /\b(news|latest|current|recent|research|evidence|verify|discover|learn)\b/.test(
        text,
      );

    const generation =
      /\b(create|generate|make|build|design|produce|video|image|workflow|app)\b/.test(
        text,
      );

    const communication =
      /\b(send|email|message|publish|post|share)\b/.test(text);

    const deployment =
      /\b(deploy|release|production|publish|launch)\b/.test(text);

    if (communication || deployment) {
      return {
        id: id('action'),
        kind: communication ? 'communication' : 'deployment',
        name: communication ? 'External communication' : 'Deployment',
        description: context.imaginedIdea,
        risk: 'external-side-effect',
        requiresPermission: true,
        requiresResearch: research,
        requiresVerification: true,
        reversible: false,
      };
    }

    if (generation) {
      return {
        id: id('action'),
        kind: 'generation',
        name: 'Create requested artifact',
        description: context.imaginedIdea,
        risk: 'reversible',
        requiresPermission: false,
        requiresResearch: research,
        requiresVerification: true,
        reversible: true,
      };
    }

    if (research) {
      return {
        id: id('action'),
        kind: 'research',
        name: 'Research and verify',
        description: context.imaginedIdea,
        risk: 'read-only',
        requiresPermission: false,
        requiresResearch: true,
        requiresVerification: true,
        reversible: true,
      };
    }

    return {
      id: id('action'),
      kind: 'plan',
      name: 'Convert idea into executable plan',
      description: context.imaginedIdea,
      risk: 'read-only',
      requiresPermission: false,
      requiresResearch: false,
      requiresVerification: true,
      reversible: true,
    };
  }

  authorize(action: RealWorldAction): RealWorldActionResult {
    if (action.kind === 'communication' || action.kind === 'deployment') {
      return {
        actionId: action.id,
        status: 'awaiting-permission',
        error:
          'Explicit permission is required before an external side-effect.',
      };
    }

    if (action.risk === 'high-impact') {
      return {
        actionId: action.id,
        status: 'awaiting-permission',
        error: 'High-impact action requires explicit permission.',
      };
    }

    return {
      actionId: action.id,
      status: 'planned',
    };
  }

  buildExecutionPlan(
    context: ImaginationExecutionContext,
  ): RealWorldActionResult[] {
    const action = this.createAction(context);
    const authorization = this.authorize(action);

    if (authorization.status === 'awaiting-permission') {
      return [authorization];
    }

    return [
      {
        actionId: action.id,
        status: 'planned',
        output: {
          action,
          executionContract: [
            'research-if-required',
            'permission-if-required',
            'execute-through-existing-tool-bus-or-execution-engine',
            'verify-result',
            'recover-on-failure',
          ],
        },
      },
    ];
  }

  getPolicy(): RealWorldExecutionPolicy {
    return { ...this.policy };
  }

  static isExternalAction(action: RealWorldAction): boolean {
    return externalRisk(action.risk);
  }
}

export default InstructorRealWorldExecutor;

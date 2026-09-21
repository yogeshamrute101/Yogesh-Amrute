/**
 * VidoAI Autonomous Cognitive Core
 *
 * "Own mind" here means an autonomous software decision loop:
 *
 * Observe
 * → Understand
 * → Remember
 * → Reason
 * → Plan
 * → Act
 * → Validate
 * → Learn
 *
 * This is software autonomy, not human consciousness.
 */

export interface MindContext {
  goal?: string;
  observations: unknown[];
  memories: unknown[];
  constraints: string[];
}

export interface MindPlan {
  objective: string;
  steps: string[];
  risks: string[];
  requiresApproval: boolean;
}

export interface MindResult {
  success: boolean;
  observation: unknown;
  plan?: MindPlan;
  action?: unknown;
  validation?: unknown;
  nextStep?: string;
}

export interface MindCapability {
  name: string;
  canHandle(context: MindContext): boolean;
  execute(context: MindContext, plan: MindPlan): Promise<unknown>;
}

export class AutonomousMind {
  private readonly capabilities: MindCapability[] = [];

  registerCapability(capability: MindCapability): void {
    this.capabilities.push(capability);
  }

  observe(observations: unknown[]): MindContext {
    return {
      observations,
      memories: [],
      constraints: [],
    };
  }

  reason(context: MindContext): MindPlan {
    const objective =
      context.goal ??
      "Understand the current situation and determine the safest useful next action.";

    const capable = this.capabilities
      .filter((item) => item.canHandle(context))
      .map((item) => item.name);

    return {
      objective,
      steps: [
        "Understand current context",
        "Check available capabilities",
        capable.length
          ? `Use compatible capability: ${capable.join(", ")}`
          : "Determine whether additional capability is required",
        "Validate the result",
        "Preserve recoverability",
      ],
      risks: [],
      requiresApproval: false,
    };
  }

  async think(context: MindContext): Promise<MindPlan> {
    return this.reason(context);
  }

  async act(
    context: MindContext,
    plan: MindPlan,
  ): Promise<unknown> {
    const capability = this.capabilities.find((item) =>
      item.canHandle(context),
    );

    if (!capability) {
      return {
        status: "no-compatible-capability",
        message: "No compatible capability is currently available.",
      };
    }

    return capability.execute(context, plan);
  }

  async run(context: MindContext): Promise<MindResult> {
    const plan = await this.think(context);

    if (plan.requiresApproval) {
      return {
        success: false,
        observation: context.observations,
        plan,
        nextStep: "User approval required before action.",
      };
    }

    const action = await this.act(context, plan);

    return {
      success: true,
      observation: context.observations,
      plan,
      action,
      validation: {
        status: "pending",
        message: "Action result must be validated by the caller.",
      },
      nextStep: "Validate result and update project memory.",
    };
  }
}

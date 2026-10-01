export type ToolCapability =
  | 'text'
  | 'image'
  | 'video'
  | 'audio'
  | 'food'
  | 'frontend'
  | 'backend'
  | 'data'
  | 'agent'
  | 'workflow'
  | 'testing'
  | 'recovery';

export interface CapabilityToolContext {
  goal: string;
  input?: unknown;
  metadata?: Record<string, unknown>;
}

export interface CapabilityToolResult {
  success: boolean;
  capability: ToolCapability;
  status: 'completed' | 'not-connected' | 'failed';
  output?: unknown;
  message: string;
  verified: boolean;
}

export interface CapabilityTool {
  id: string;
  capability: ToolCapability;
  description: string;
  available: boolean;
  execute(
    context: CapabilityToolContext
  ): Promise<CapabilityToolResult>;
}

export class CapabilityToolBus {
  private readonly tools = new Map<string, CapabilityTool>();

  register(tool: CapabilityTool) {
    this.tools.set(tool.id, tool);
    return tool.id;
  }

  get(id: string) {
    return this.tools.get(id);
  }

  findByCapability(capability: ToolCapability) {
    return [...this.tools.values()].filter(
      tool => tool.capability === capability
    );
  }

  list() {
    return [...this.tools.values()].map(tool => ({
      id: tool.id,
      capability: tool.capability,
      description: tool.description,
      available: tool.available,
    }));
  }

  async execute(
    capability: ToolCapability,
    context: CapabilityToolContext
  ): Promise<CapabilityToolResult> {
    const candidates = this.findByCapability(capability);

    const tool = candidates.find(item => item.available);

    if (!tool) {
      return {
        success: false,
        capability,
        status: 'not-connected',
        message:
          `No executable tool is currently connected for capability "${capability}".`,
        verified: false,
      };
    }

    try {
      const result = await tool.execute(context);

      if (!result.success) {
        return {
          ...result,
          verified: false,
        };
      }

      return result;
    } catch (error) {
      return {
        success: false,
        capability,
        status: 'failed',
        message:
          error instanceof Error
            ? error.message
            : 'Capability execution failed.',
        verified: false,
      };
    }
  }
}

export const capabilityToolBus = new CapabilityToolBus();

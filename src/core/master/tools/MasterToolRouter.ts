import {
  capabilityToolBus,
  CapabilityToolResult,
  ToolCapability,
} from './CapabilityToolBus';

import './BuiltInCapabilityTools';

export class MasterToolRouter {
  resolve(capability: ToolCapability) {
    return capabilityToolBus.findByCapability(capability);
  }

  async execute(
    capability: ToolCapability,
    goal: string,
    input?: unknown
  ): Promise<CapabilityToolResult> {
    return capabilityToolBus.execute(
      capability,
      {
        goal,
        input,
        metadata: {
          source: 'VidoAI Master Instructor',
        },
      }
    );
  }

  inventory() {
    return capabilityToolBus.list();
  }
}

export const masterToolRouter = new MasterToolRouter();

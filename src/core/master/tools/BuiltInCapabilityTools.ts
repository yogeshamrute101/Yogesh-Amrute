import {
  CapabilityTool,
  CapabilityToolContext,
  CapabilityToolResult,
  capabilityToolBus,
} from './CapabilityToolBus';

function unavailableTool(
  id: string,
  capability: CapabilityTool['capability'],
  description: string
): CapabilityTool {
  return {
    id,
    capability,
    description,
    available: false,

    async execute(
      _context: CapabilityToolContext
    ): Promise<CapabilityToolResult> {
      return {
        success: false,
        capability,
        status: 'not-connected',
        message:
          `Tool "${id}" is defined but its real provider is not connected.`,
        verified: false,
      };
    },
  };
}

const tools: CapabilityTool[] = [
  unavailableTool(
    'video-generation',
    'video',
    'Generates video through a configured video provider.'
  ),

  unavailableTool(
    'image-generation',
    'image',
    'Generates images through a configured image provider.'
  ),

  unavailableTool(
    'audio-generation',
    'audio',
    'Generates or processes audio through a configured audio provider.'
  ),

  unavailableTool(
    'food-recipe-engine',
    'food',
    'Creates structured recipes and cooking instructions from a food request.'
  ),

  unavailableTool(
    'frontend-builder',
    'frontend',
    'Builds or updates VidoAI frontend components.'
  ),

  unavailableTool(
    'backend-builder',
    'backend',
    'Builds or updates backend/API capabilities.'
  ),

  unavailableTool(
    'agent-runtime',
    'agent',
    'Executes registered autonomous agents.'
  ),

  unavailableTool(
    'workflow-runtime',
    'workflow',
    'Executes registered agent workflows.'
  ),
];

for (const tool of tools) {
  if (!capabilityToolBus.get(tool.id)) {
    capabilityToolBus.register(tool);
  }
}

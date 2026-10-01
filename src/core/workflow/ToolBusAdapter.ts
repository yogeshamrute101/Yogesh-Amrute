import { WorkflowExecutionContext } from './WorkflowEngine';
import { ToolExecutionAdapter } from './ToolNodeExecutor';

export interface WorkflowToolBus {
  execute(
    toolName: string,
    input: unknown,
    context?: WorkflowExecutionContext
  ): Promise<unknown>;
}

export class ToolBusAdapter implements ToolExecutionAdapter {
  constructor(private readonly toolBus: WorkflowToolBus) {}

  async execute(
    toolName: string,
    input: unknown,
    context: WorkflowExecutionContext
  ): Promise<unknown> {
    const normalizedToolName = String(toolName ?? '').trim();

    if (!normalizedToolName) {
      throw new Error('ToolBus adapter requires a tool name');
    }

    return this.toolBus.execute(
      normalizedToolName,
      input,
      context
    );
  }
}

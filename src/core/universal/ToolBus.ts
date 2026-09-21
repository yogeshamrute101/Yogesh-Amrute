export type Permission =
  | 'READ' | 'SEARCH' | 'CREATE' | 'EDIT'
  | 'UPLOAD' | 'DOWNLOAD' | 'SEND' | 'DELETE'
  | 'EXECUTE' | 'PURCHASE' | 'DEPLOY';

export interface UniversalTool {
  id: string;
  name: string;
  capabilities: string[];
  permissions: Permission[];
  execute?: (input: unknown) => Promise<unknown>;
}

export class ToolBus {
  private tools = new Map<string, UniversalTool>();

  register(tool: UniversalTool) {
    this.tools.set(tool.id, tool);
  }

  search(capability: string) {
    return [...this.tools.values()].filter(t =>
      t.capabilities.includes(capability)
    );
  }

  get(id: string) {
    return this.tools.get(id);
  }

  async execute(id: string, input: unknown) {
    const tool = this.tools.get(id);
    if (!tool) throw new Error(`Tool not found: ${id}`);
    if (!tool.execute) {
      return { status: 'registered', toolId: id, input };
    }
    return tool.execute(input);
  }
}

export interface FileSystemNode {
  id: string;
  name: string;
  type: "FILE" | "FOLDER";
  path: string;
  parentId?: string;
  mimeType?: string;
  size?: number;
  children?: string[];
}

export class FileFolderUnderstanding {
  describe(node: FileSystemNode) {
    return {
      ...node,
      relationships: node.children ?? [],
      safeOperations: ["READ", "INSPECT", "RENAME", "MOVE", "COPY"],
      destructiveOperationsRequireApproval: true,
    };
  }
}

export interface ExtensionContract {
  id: string;
  name: string;
  version: string;
  apiVersion: string;
  capabilities: string[];
  dependencies?: string[];
  compatibility?: string[];
  enabled: boolean;
}

export class ExtensionRegistry {
  private extensions = new Map<string, ExtensionContract>();

  register(extension: ExtensionContract) {
    this.extensions.set(extension.id, { ...extension });
    return extension;
  }

  compatible(apiVersion: string) {
    return [...this.extensions.values()]
      .filter(x => x.apiVersion === apiVersion);
  }

  get(id: string) {
    return this.extensions.get(id);
  }

  all() {
    return [...this.extensions.values()];
  }
}

export type SoftwareComponent =
  | "APPLICATION"
  | "SERVICE"
  | "API"
  | "DATABASE"
  | "LIBRARY"
  | "PACKAGE"
  | "MODULE"
  | "PLUGIN"
  | "CONFIGURATION";

export interface SoftwareEntity {
  id: string;
  name: string;
  type: SoftwareComponent;
  version?: string;
  dependencies?: string[];
  interfaces?: string[];
}

export class SoftwareUnderstandingEngine {
  analyze(entity: SoftwareEntity) {
    return {
      ...entity,
      dependencyCount: entity.dependencies?.length ?? 0,
      interfaceCount: entity.interfaces?.length ?? 0,
      verified: false,
    };
  }
}

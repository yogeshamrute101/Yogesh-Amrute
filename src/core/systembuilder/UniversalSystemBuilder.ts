export type SystemType =
  | "ERP"
  | "LIMS"
  | "CRM"
  | "HRMS"
  | "SCM"
  | "MES"
  | "WMS"
  | "QMS"
  | "CMMS"
  | "DMS"
  | "EMR"
  | "EHR"
  | "FINANCE"
  | "EDUCATION"
  | "ECOMMERCE"
  | "MEDIA"
  | "CUSTOM";

export type BuildStage =
  | "DISCOVERY"
  | "REQUIREMENTS"
  | "ARCHITECTURE"
  | "DATA_MODEL"
  | "UX"
  | "BACKEND"
  | "FRONTEND"
  | "INTEGRATION"
  | "SECURITY"
  | "TESTING"
  | "DEPLOYMENT"
  | "MONITORING"
  | "MAINTENANCE";

export interface SystemRequirement {
  id: string;
  description: string;
  priority: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
  acceptanceCriteria: string[];
}

export interface SystemModule {
  id: string;
  name: string;
  description: string;
  dependencies: string[];
  status:
    | "PLANNED"
    | "BUILDING"
    | "INTEGRATED"
    | "TESTING"
    | "VERIFIED";
}

export interface SystemSpecification {
  id: string;
  name: string;
  type: SystemType;
  purpose: string;
  requirements: SystemRequirement[];
  modules: SystemModule[];
  integrations: string[];
  securityRequirements: string[];
  complianceRequirements: string[];
  currentStage: BuildStage;
}

export interface BuildResult {
  systemId: string;
  stage: BuildStage;
  success: boolean;
  artifacts: string[];
  findings: string[];
  blockers: string[];
  verificationRequired: boolean;
  timestamp: number;
}

export class UniversalSystemBuilder {
  private systems = new Map<string, SystemSpecification>();
  private results = new Map<string, BuildResult>();

  createSystem(
    name: string,
    type: SystemType,
    purpose: string
  ): SystemSpecification {
    const system: SystemSpecification = {
      id: `system-${Date.now()}`,
      name,
      type,
      purpose,
      requirements: [],
      modules: [],
      integrations: [],
      securityRequirements: [],
      complianceRequirements: [],
      currentStage: "DISCOVERY",
    };

    this.systems.set(system.id, system);
    return system;
  }

  addRequirement(
    systemId: string,
    requirement: SystemRequirement
  ) {
    const system = this.systems.get(systemId);
    if (system) system.requirements.push(requirement);
  }

  addModule(
    systemId: string,
    module: SystemModule
  ) {
    const system = this.systems.get(systemId);
    if (system) system.modules.push(module);
  }

  advanceStage(
    systemId: string,
    stage: BuildStage
  ) {
    const system = this.systems.get(systemId);
    if (system) system.currentStage = stage;
  }

  recordResult(result: BuildResult) {
    this.results.set(result.systemId, result);
  }

  getSystem(systemId: string) {
    return this.systems.get(systemId);
  }

  getSystems() {
    return [...this.systems.values()];
  }

  getResults() {
    return [...this.results.values()];
  }
}

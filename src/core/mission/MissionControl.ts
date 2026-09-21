export type MissionStatus =
  | "IDEA"
  | "RESEARCH"
  | "DESIGN"
  | "SIMULATION"
  | "READY"
  | "ACTIVE"
  | "PAUSED"
  | "RECOVERY"
  | "COMPLETED"
  | "FAILED";

export interface MissionObjective {
  id: string;
  title: string;
  description: string;
  priority: number;
  successCriteria: string[];
}

export interface MissionMilestone {
  id: string;
  title: string;
  deadline?: number;
  dependencies: string[];
  completed: boolean;
}

export interface MissionRisk {
  id: string;
  description: string;
  probability: number;
  impact: number;
  mitigation: string;
}

export interface MissionResource {
  id: string;
  name: string;
  type: string;
  available: boolean;
  capacity?: number;
}

export interface Mission {
  id: string;
  name: string;
  status: MissionStatus;
  objectives: MissionObjective[];
  milestones: MissionMilestone[];
  risks: MissionRisk[];
  resources: MissionResource[];
  telemetry: Record<string, unknown>[];
  logs: string[];
  createdAt: number;
}

export class MissionControl {
  createMission(
    name: string,
    objectives: MissionObjective[]
  ): Mission {
    return {
      id: `mission-${Date.now()}`,
      name,
      status: "IDEA",
      objectives,
      milestones: [],
      risks: [],
      resources: [],
      telemetry: [],
      logs: [],
      createdAt: Date.now(),
    };
  }

  addMilestone(
    mission: Mission,
    milestone: MissionMilestone
  ): Mission {
    return {
      ...mission,
      milestones: [...mission.milestones, milestone],
    };
  }

  addRisk(
    mission: Mission,
    risk: MissionRisk
  ): Mission {
    return {
      ...mission,
      risks: [...mission.risks, risk],
    };
  }

  addResource(
    mission: Mission,
    resource: MissionResource
  ): Mission {
    return {
      ...mission,
      resources: [...mission.resources, resource],
    };
  }

  updateStatus(
    mission: Mission,
    status: MissionStatus
  ): Mission {
    return {
      ...mission,
      status,
      logs: [
        ...mission.logs,
        `${new Date().toISOString()}: status -> ${status}`,
      ],
    };
  }

  recordTelemetry(
    mission: Mission,
    telemetry: Record<string, unknown>
  ): Mission {
    return {
      ...mission,
      telemetry: [...mission.telemetry, telemetry],
    };
  }

  addLog(
    mission: Mission,
    message: string
  ): Mission {
    return {
      ...mission,
      logs: [...mission.logs, message],
    };
  }
}

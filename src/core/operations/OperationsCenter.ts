import { Mission, MissionControl } from "../mission/MissionControl";

export interface OperationCheck {
  name: string;
  passed: boolean;
  message: string;
}

export interface MissionReadiness {
  ready: boolean;
  checks: OperationCheck[];
}

export class OperationsCenter {
  private missionControl = new MissionControl();

  checkReadiness(mission: Mission): MissionReadiness {
    const checks: OperationCheck[] = [
      {
        name: "Objectives",
        passed: mission.objectives.length > 0,
        message: "Mission must have at least one objective.",
      },
      {
        name: "Resources",
        passed: mission.resources.length > 0,
        message: "Mission should have declared resources.",
      },
      {
        name: "Risk",
        passed: mission.risks.every(
          (risk) => risk.mitigation.trim().length > 0
        ),
        message: "Every known risk needs mitigation.",
      },
      {
        name: "Milestones",
        passed: mission.milestones.length > 0,
        message: "Mission should have measurable milestones.",
      },
    ];

    return {
      ready: checks.every((check) => check.passed),
      checks,
    };
  }

  start(mission: Mission): Mission {
    const readiness = this.checkReadiness(mission);

    if (!readiness.ready) {
      return this.missionControl.addLog(
        mission,
        "Mission start blocked: readiness checks failed."
      );
    }

    return this.missionControl.updateStatus(mission, "ACTIVE");
  }

  recover(mission: Mission, reason: string): Mission {
    const updated = this.missionControl.updateStatus(
      mission,
      "RECOVERY"
    );

    return this.missionControl.addLog(
      updated,
      `Recovery initiated: ${reason}`
    );
  }
}

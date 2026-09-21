export interface HumanoidRobotProfile {
  id: string;
  name: string;
  capabilities: string[];
  sensorTypes: string[];
  simulationOnly: boolean;
}

export const humanoidRobotProfile: HumanoidRobotProfile = {
  id: "humanoid-primary",
  name: "Primary Humanoid Robot",
  capabilities: [
    "observe",
    "navigate",
    "communicate",
    "manipulate",
    "inspect",
  ],
  sensorTypes: [
    "camera",
    "microphone",
    "imu",
    "proximity",
    "force",
    "temperature",
  ],
  simulationOnly: true,
};

import { AgentRole } from "../types";

export interface Agent {
  role: AgentRole;
  name: string;
  description: string;
}

export const autonomousAgents: Agent[] = [
  {
    role: "planner",
    name: "Planner",
    description: "Breaks goals into executable tasks.",
  },
  {
    role: "researcher",
    name: "Researcher",
    description: "Finds relevant available knowledge and context.",
  },
  {
    role: "executor",
    name: "Executor",
    description: "Runs registered application capabilities.",
  },
  {
    role: "verifier",
    name: "Verifier",
    description: "Checks whether the result satisfies the goal.",
  },
  {
    role: "recovery",
    name: "Recovery",
    description: "Attempts safe corrective actions.",
  },
  {
    role: "learner",
    name: "Learner",
    description: "Stores reusable lessons from outcomes.",
  },
];

export interface CentralComputerState {
  online: boolean;
  responsibilities: string[];
}

export const centralComputer: CentralComputerState = {
  online: true,
  responsibilities: [
    "MasterMind orchestration",
    "World model coordination",
    "Memory",
    "Decision coordination",
    "Safety coordination",
    "Robot coordination",
    "Human command processing",
  ],
};

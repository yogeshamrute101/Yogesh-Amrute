import { SystemOrchestrator } from "./SystemOrchestrator";

export function createSystemOrchestrator() {
  const system = new SystemOrchestrator();

  const capabilities = [
    ["universal-core", "Universal Core"],
    ["autonomous-mind", "Autonomous Mind"],
    ["mastermind", "MasterMind"],
    ["project-awareness", "Project Awareness"],
    ["engineering-context", "Engineering Context"],
    ["command-safety", "Command Safety"],
    ["memory", "Memory & Knowledge"],
    ["verification", "Verification"],
    ["governance", "Governance"],
    ["rca", "Root Cause Analysis"],
    ["capa", "CAPA"],
    ["logic", "Logic Control"],
    ["multi-task", "Multi-Tasking"],
    ["continuous-loop", "Continuous Life Loop"],
    ["assistant", "VidoAI Assistant"],
    ["fast-agent", "Fast Project Agent"],
  ] as const;

  for (const [id, name] of capabilities) {
    system.registerCapability({
      id,
      name,
      status: "INTEGRATED",
      dependencies: [],
      evidence: ["Registered in central system orchestrator"],
    });
  }

  return system;
}
